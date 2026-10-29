export const prerender = false;

import type { APIRoute } from 'astro';
import { ACCENT_COLOR, PIECES, type JewelryPiece } from '../../data/pieces';
import { env, isAuthenticated } from '../../lib/auth';

// Saves go straight to GitHub as one commit; the host (Vercel) redeploys from it.
// Works the same locally and on serverless, where the disk is read-only and there is no git.

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
// Vercel rejects request bodies over 4.5 MB, so cap the whole save below that
const MAX_TOTAL_UPLOAD_BYTES = 4 * 1024 * 1024;

// Known protected images that should never be deleted automatically (e.g. Hero background)
const PROTECTED_IMAGES = new Set(['806408f67066834bd64370cdf37369f2.jpg', 'placeholder.svg']);

function jsonError(error: string, status: number): Response {
  return new Response(JSON.stringify({ error }), { status, headers: { 'Content-Type': 'application/json' } });
}

const extname = (name: string) => (name.match(/\.[^./]+$/)?.[0] ?? '').toLowerCase();
const basename = (p: string) => p.split('/').pop() ?? '';

async function github(repo: string, token: string, apiPath: string, init: { method?: string; body?: unknown } = {}) {
  const res = await fetch(`https://api.github.com/repos/${repo}${apiPath}`, {
    method: init.method ?? 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  if (!res.ok) {
    throw new Error(`GitHub ${init.method ?? 'GET'} ${apiPath} failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    if (!isAuthenticated(cookies)) {
      return jsonError('Unauthorized or session expired. Please log in again.', 401);
    }

    const token = env('GITHUB_TOKEN');
    const repo = env('GITHUB_REPO');
    const branch = env('GITHUB_BRANCH') ?? 'main';
    if (!token || !repo) {
      return jsonError('Saving is not configured: set GITHUB_TOKEN and GITHUB_REPO on the server.', 500);
    }

    const formData = await request.formData();

    const piecesJson = formData.get('pieces');
    if (!piecesJson || typeof piecesJson !== 'string') {
      return jsonError('Missing pieces data.', 400);
    }

    let pieces: JewelryPiece[];
    try {
      pieces = JSON.parse(piecesJson);
    } catch {
      return jsonError('Invalid pieces JSON format.', 400);
    }
    if (!Array.isArray(pieces)) {
      return jsonError('Invalid pieces JSON format.', 400);
    }

    // Validate every upload before touching GitHub.
    // Only real images: an uploaded .html/.svg in public/ would run script on our origin.
    let totalBytes = 0;
    for (let i = 0; i < pieces.length; i++) {
      const file = formData.get(`image_${i}`);
      if (!(file instanceof File) || file.size === 0) continue;
      if (!ALLOWED_EXTENSIONS.has(extname(file.name)) || !file.type.startsWith('image/')) {
        return jsonError(`Image ${i + 1}: only JPG, PNG or WEBP files are allowed.`, 400);
      }
      totalBytes += file.size;
    }
    if (totalBytes > MAX_TOTAL_UPLOAD_BYTES) {
      return jsonError('Uploaded images add up to more than 4 MB. Save fewer at a time or use smaller files.', 400);
    }

    const tree: Array<{ path: string; mode: '100644'; type: 'blob'; sha?: string | null; content?: string }> = [];

    // Images used by the currently deployed pieces are deletion candidates until reused below
    const imagesToDelete = new Set<string>();
    for (const prev of PIECES) {
      const base = basename(prev.image || '');
      if (base && !PROTECTED_IMAGES.has(base)) imagesToDelete.add(base);
    }

    for (let i = 0; i < pieces.length; i++) {
      const piece = pieces[i];
      const file = formData.get(`image_${i}`);

      if (file instanceof File && file.size > 0) {
        const cleanCode = (piece.code || `piece-${i}`).toLowerCase().replace(/[^a-z0-9]/g, '');
        const filename = `${cleanCode}-${Date.now()}${extname(file.name)}`;
        const blob = await github(repo, token, '/git/blobs', {
          method: 'POST',
          body: { content: Buffer.from(await file.arrayBuffer()).toString('base64'), encoding: 'base64' },
        });
        tree.push({ path: `public/assets/${filename}`, mode: '100644', type: 'blob', sha: blob.sha });
        piece.image = `/assets/${filename}`;
      }

      if (!piece.id) {
        piece.id = piece.code || `piece-${i}`;
      }
    }

    // Preserve any image that is still used by any piece in the updated list
    for (const piece of pieces) {
      imagesToDelete.delete(basename(piece.image || ''));
    }

    // Only delete files that really exist on the branch (GitHub rejects deleting missing paths)
    const existing: Array<{ name: string }> = await github(repo, token, `/contents/public/assets?ref=${encodeURIComponent(branch)}`);
    const existingNames = new Set(existing.map((f) => f.name));
    for (const filename of imagesToDelete) {
      if (existingNames.has(filename)) {
        tree.push({ path: `public/assets/${filename}`, mode: '100644', type: 'blob', sha: null });
      }
    }

    tree.push({
      path: 'src/data/pieces.ts',
      mode: '100644',
      type: 'blob',
      content: `export interface JewelryPiece {
  id: string;
  name: string;
  code: string;
  desc: string;
  image: string;
  alt: string;
}

export const PIECES: JewelryPiece[] = ${JSON.stringify(pieces, null, 2)};

export const ACCENT_COLOR = ${JSON.stringify(ACCENT_COLOR || '#E0A030')};
`,
    });

    // One commit for everything: new tree on top of the branch head, then move the branch
    const ref = await github(repo, token, `/git/ref/heads/${branch}`);
    const headSha: string = ref.object.sha;
    const headCommit = await github(repo, token, `/git/commits/${headSha}`);
    const newTree = await github(repo, token, '/git/trees', {
      method: 'POST',
      body: { base_tree: headCommit.tree.sha, tree },
    });

    let gitMessage = `No changes detected on branch '${branch}'.`;
    if (newTree.sha !== headCommit.tree.sha) {
      const commit = await github(repo, token, '/git/commits', {
        method: 'POST',
        body: {
          message: 'chore(carousel): update pieces via admin form',
          tree: newTree.sha,
          parents: [headSha],
          author: { name: 'Suria Admin', email: 'admin@suriadesign.local' },
        },
      });
      await github(repo, token, `/git/refs/heads/${branch}`, {
        method: 'PATCH',
        body: { sha: commit.sha },
      });
      gitMessage = `Committed to GitHub branch '${branch}'. The live site updates after the next deploy (about a minute).`;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Carousel updated successfully!',
        gitStatus: gitMessage,
        pieces,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('update-carousel failed:', err);
    return jsonError('Server error updating carousel. Check the server log.', 500);
  }
};
