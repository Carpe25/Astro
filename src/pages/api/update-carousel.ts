export const prerender = false;

import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { ACCENT_COLOR } from '../../data/pieces';
import { isAuthenticated } from '../../lib/auth';

const execAsync = promisify(exec);

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    if (!isAuthenticated(cookies)) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized or session expired. Please log in again.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const formData = await request.formData();

    const piecesJson = formData.get('pieces');
    if (!piecesJson || typeof piecesJson !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing pieces data.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let pieces: Array<{
      id: string;
      name: string;
      code: string;
      desc: string;
      image: string;
      alt: string;
    }>;

    try {
      pieces = JSON.parse(piecesJson);
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid pieces JSON format.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const publicAssetsDir = path.resolve(process.cwd(), 'public/assets');
    const rootAssetsDir = path.resolve(process.cwd(), 'assets');
    await fs.mkdir(publicAssetsDir, { recursive: true });
    await fs.mkdir(rootAssetsDir, { recursive: true });

    // Known protected images that should never be deleted automatically (e.g. Hero background)
    const protectedImages = new Set([
      '806408f67066834bd64370cdf37369f2.jpg',
      'placeholder.svg',
      'placeholder.jpg',
      'placeholder.png'
    ]);

    const imagesToDelete = new Set<string>();

    // Inspect previous pieces.ts to identify any orphaned images from replaced/deleted pieces
    const piecesFilePath = path.resolve(process.cwd(), 'src/data/pieces.ts');
    try {
      const prevContent = await fs.readFile(piecesFilePath, 'utf-8');
      const match = prevContent.match(/export const PIECES: JewelryPiece\[\] = (\[[\s\S]*?\]);/);
      if (match) {
        const prevPieces = JSON.parse(match[1]);
        if (Array.isArray(prevPieces)) {
          for (const prev of prevPieces) {
            if (prev.image) {
              const base = path.basename(prev.image);
              if (base && !protectedImages.has(base)) {
                imagesToDelete.add(base);
              }
            }
          }
        }
      }
    } catch {
      // Continue if reading previous file fails
    }

    // Process each piece and any uploaded image files
    for (let i = 0; i < pieces.length; i++) {
      const piece = pieces[i];
      const uploadedFile = formData.get(`image_${i}`) as File | null;

      if (uploadedFile && uploadedFile.size > 0) {
        // Track the previous image being replaced
        if (piece.image && typeof piece.image === 'string') {
          const oldFilename = path.basename(piece.image);
          if (oldFilename && !protectedImages.has(oldFilename)) {
            imagesToDelete.add(oldFilename);
          }
        }

        const origExt = path.extname(uploadedFile.name) || '.jpg';
        const cleanCode = (piece.code || `piece-${i}`)
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '');
        const filename = `${cleanCode}-${Date.now()}${origExt}`;
        const publicFilePath = path.join(publicAssetsDir, filename);
        const rootFilePath = path.join(rootAssetsDir, filename);

        const arrayBuffer = await uploadedFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await fs.writeFile(publicFilePath, buffer);
        await fs.writeFile(rootFilePath, buffer);

        piece.image = `/assets/${filename}`;
      }

      // Ensure piece has an ID
      if (!piece.id) {
        piece.id = piece.code || `piece-${i}`;
      }
    }

    // Preserve any image that is still used by any piece in the updated list
    for (const piece of pieces) {
      if (piece.image) {
        const basename = path.basename(piece.image);
        imagesToDelete.delete(basename);
      }
    }

    // Delete old replaced/removed images from both public/assets and assets
    for (const filename of imagesToDelete) {
      try {
        await fs.unlink(path.join(publicAssetsDir, filename));
      } catch {
        // Ignore if file doesn't exist
      }
      try {
        await fs.unlink(path.join(rootAssetsDir, filename));
      } catch {
        // Ignore if file doesn't exist
      }
    }

    // Format new src/data/pieces.ts content
    const piecesTsContent = `export interface JewelryPiece {
  id: string;
  name: string;
  code: string;
  desc: string;
  image: string;
  alt: string;
}

export const PIECES: JewelryPiece[] = ${JSON.stringify(pieces, null, 2)};

export const ACCENT_COLOR = ${JSON.stringify(ACCENT_COLOR || '#E0A030')};
`;

    await fs.writeFile(piecesFilePath, piecesTsContent, 'utf-8');

    // Perform Git Commit
    let gitMessage = 'Changes saved locally.';
    try {
      await execAsync('git add assets public/assets src/data/pieces.ts');
      
      // Detect currently active branch
      let currentBranch = 'main';
      try {
        const { stdout: branchOut } = await execAsync('git rev-parse --abbrev-ref HEAD');
        currentBranch = branchOut.trim() || 'main';
      } catch {
        // fallback to main
      }

      // Check if there are staged changes
      const { stdout: statusOut } = await execAsync('git diff --staged --name-only');
      if (statusOut.trim().length > 0) {
        await execAsync(
          'git commit --author="Suria Admin <admin@suriadesign.local>" -m "chore(carousel): update pieces via admin form"'
        );
        gitMessage = `Committed changes to branch '${currentBranch}'.`;

        // Attempt git push to the active branch
        try {
          await execAsync(`git push -u origin ${currentBranch}`);
          gitMessage = `Committed and pushed to branch '${currentBranch}' successfully.`;
        } catch (pushErr: any) {
          gitMessage = `Committed to '${currentBranch}' locally. (Push notice: ${pushErr.message || 'push failed or remote not reachable'})`;
        }
      } else {
        gitMessage = `No changes detected between submitted data and existing files on branch '${currentBranch}'.`;
      }
    } catch (gitErr: any) {
      gitMessage = `Files saved, but git error occurred: ${gitErr.message}`;
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
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Server error updating carousel' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
