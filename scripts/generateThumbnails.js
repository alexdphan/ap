#!/usr/bin/env node

/**
 * FFmpeg Thumbnail Generation Script
 * 
 * Generates real thumbnails from video URLs using ffmpeg
 * Runs automatically when dev server starts
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Import video data
const videosPath = path.join(__dirname, '../data/videos.ts');

async function checkThumbnailStatus() {
  console.log('🔍 Checking thumbnail status...');

  try {
    // Read and parse the videos file
    const videosContent = fs.readFileSync(videosPath, 'utf8');
    
    // Extract video URLs and check for thumbnailUrl
    const videoEntries = [];
    const videoRegex = /\{[^}]*?videoUrl:\s*["']([^"']+)["'][^}]*?\}/gs;
    let match;
    
    while ((match = videoRegex.exec(videosContent)) !== null) {
      const videoObject = match[0];
      const videoUrl = match[1];
      const hasThumbnailUrl = videoObject.includes('thumbnailUrl:');
      const videoName = path.basename(videoUrl, '.mp4');
      
      // Check if thumbnail file exists
      const thumbnailPath = path.join(__dirname, '../public/thumbnails', `${videoName}.jpg`);
      const thumbnailExists = fs.existsSync(thumbnailPath);
      
      videoEntries.push({
        videoUrl,
        videoName,
        hasThumbnailUrl,
        thumbnailExists
      });
    }

    const missingThumbnailUrls = videoEntries.filter(entry => !entry.hasThumbnailUrl);
    const missingThumbnailFiles = videoEntries.filter(entry => entry.hasThumbnailUrl && !entry.thumbnailExists);
    const needsGeneration = videoEntries.filter(entry => !entry.hasThumbnailUrl || !entry.thumbnailExists);

    console.log(`📊 Thumbnail Status Report:`);
    console.log(`   Total videos: ${videoEntries.length}`);
    console.log(`   ✅ Complete (URL + file): ${videoEntries.length - needsGeneration.length}`);
    console.log(`   ❌ Missing thumbnailUrl in data/videos.ts: ${missingThumbnailUrls.length}`);
    console.log(`   ❌ Missing thumbnail files: ${missingThumbnailFiles.length}`);
    
    if (needsGeneration.length > 0) {
      console.log(`\n🎯 Action needed: Run "npm run thumbnails" to generate ${needsGeneration.length} thumbnails`);
      needsGeneration.forEach(entry => {
        const reason = !entry.hasThumbnailUrl ? 'missing URL' : 'missing file';
        console.log(`   - ${entry.videoName} (${reason})`);
      });
      return false;
    } else {
      console.log('\n✅ All thumbnails are ready! No action needed.');
      return true;
    }

  } catch (error) {
    console.error('❌ Error checking thumbnail status:', error);
    return false;
  }
}

async function generateThumbnailsFromVideos() {
  console.log('🎬 Starting thumbnail generation with ffmpeg...');

  try {
    // Read and parse the videos file
    const videosContent = fs.readFileSync(videosPath, 'utf8');
    
    // Extract video URLs using regex
    const videoUrlRegex = /videoUrl:\s*["']([^"']+)["']/g;
    const videoUrls = [];
    let match;
    
    while ((match = videoUrlRegex.exec(videosContent)) !== null) {
      videoUrls.push(match[1]);
    }

    console.log(`📁 Found ${videoUrls.length} videos to process`);

    // Create thumbnails directory
    const thumbnailsDir = path.join(__dirname, '../public/thumbnails');
    if (!fs.existsSync(thumbnailsDir)) {
      fs.mkdirSync(thumbnailsDir, { recursive: true });
    }

    // Generate thumbnails for each video
    const thumbnailData = [];
    
    for (let i = 0; i < videoUrls.length; i++) {
      const videoUrl = videoUrls[i];
      const videoName = path.basename(videoUrl, '.mp4');
      const thumbnailPath = path.join(thumbnailsDir, `${videoName}.jpg`);
      
      // Skip if thumbnail already exists
      if (fs.existsSync(thumbnailPath)) {
        console.log(`⏭️  Skipping ${videoName} (already exists)`);
        thumbnailData.push({
          videoUrl,
          thumbnailUrl: `/thumbnails/${videoName}.jpg`,
          index: i
        });
        continue;
      }

      console.log(`🎨 Processing ${videoName}... (${i + 1}/${videoUrls.length})`);
      
      try {
        // Use ffmpeg to generate thumbnail from video
        // Extract frame at 1 second, resize to 320x180, high quality
        const ffmpegCmd = `ffmpeg -i "${videoUrl}" -ss 00:00:01 -vframes 1 -vf "scale=320:180:force_original_aspect_ratio=decrease,pad=320:180:(ow-iw)/2:(oh-ih)/2:black" -q:v 2 "${thumbnailPath}" -y`;
        
        await execAsync(ffmpegCmd);
        
        thumbnailData.push({
          videoUrl,
          thumbnailUrl: `/thumbnails/${videoName}.jpg`,
          index: i
        });
        
        console.log(`✅ Generated thumbnail: ${videoName}.jpg`);
        
      } catch (error) {
        console.warn(`⚠️  Failed to generate thumbnail for ${videoName}:`, error.message);
      }
    }

    // Update videos.ts with thumbnail URLs
    await updateVideosWithThumbnails(thumbnailData);

    console.log('🎉 Thumbnail generation complete!');
    console.log('⚡ Thumbnails will now load instantly!');
    
  } catch (error) {
    console.error('❌ Error generating thumbnails:', error);
  }
}

async function updateVideosWithThumbnails(thumbnailData) {
  console.log('📝 Updating videos.ts with thumbnail URLs...');

  try {
    let videosContent = fs.readFileSync(videosPath, 'utf8');

    // Update each video entry with thumbnail URL
    thumbnailData.forEach(({ videoUrl, thumbnailUrl }) => {
      // Find the video object and add thumbnailUrl if it doesn't exist
      const escapedUrl = videoUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const videoRegex = new RegExp(
        `(\\{[^}]*?videoUrl:\\s*["']${escapedUrl}["'][^}]*?)(\\})`,
        'gs'
      );
      
      videosContent = videosContent.replace(videoRegex, (match, before, after) => {
        if (match.includes('thumbnailUrl:')) {
          // Already has thumbnailUrl, skip
          return match;
        }
        // Add thumbnailUrl before the closing brace
        return `${before.replace(/,?\s*$/, '')},\n    thumbnailUrl: "${thumbnailUrl}"${after}`;
      });
    });

    // Write updated content back to file
    fs.writeFileSync(videosPath, videosContent);
    console.log('✅ Updated videos.ts with thumbnail URLs');

  } catch (error) {
    console.error('❌ Error updating videos.ts:', error);
  }
}

// Main execution
if (require.main === module) {
  // Check if we should run status check or generation
  const args = process.argv.slice(2);
  if (args.includes('--check') || args.includes('-c')) {
    checkThumbnailStatus().then(() => {
      process.exit(0);
    }).catch(error => {
      console.error('❌ Status check failed:', error);
      process.exit(1);
    });
  } else {
    generateThumbnailsFromVideos().then(() => {
      console.log('🔄 Thumbnail generation complete. Server can start now.');
      process.exit(0);
    }).catch(error => {
      console.error('❌ Thumbnail generation failed:', error);
      process.exit(1);
    });
  }
}

module.exports = { generateThumbnailsFromVideos, updateVideosWithThumbnails, checkThumbnailStatus }; 