import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ImageUpload } from 'src/entities/image.entity';
import { User } from 'src/entities/user.entity';
import * as fs from 'fs/promises';
import * as path from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class ImageService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads', 'images');
  private readonly baseUrl = process.env.BASE_URL || 'http://localhost:4000';

  constructor(
    @InjectRepository(ImageUpload)
    private imageRepository: Repository<ImageUpload>,
  ) {
    this.ensureUploadDirectory();
  }

  private async ensureUploadDirectory() {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
    } catch (error) {
      console.error('Error creating upload directory:', error);
    }
  }

  async uploadImage(
    file: { originalname: string; buffer: Buffer },
    user: User,
    conversationId?: number,
  ): Promise<{ artifactId: string; imageUrl: string }> {
    // Generate unique artifact ID
    const artifactId = randomUUID();

    // Generate filename with artifact ID
    const fileExtension = path.extname(file.originalname);
    const filename = `${artifactId}${fileExtension}`;
    const localPath = path.join(this.uploadDir, filename);

    // Save file to disk
    await fs.writeFile(localPath, file.buffer);

    // Generate public URL
    const imageUrl = `${this.baseUrl}/images/${filename}`;

    // Save to database
    const imageUpload = this.imageRepository.create({
      artifactId,
      imageUrl,
      localPath,
      user,
      conversation: conversationId ? { id: conversationId } : null,
    });

    await this.imageRepository.save(imageUpload);

    return {
      artifactId,
      imageUrl,
    };
  }

  async getImageByArtifactId(artifactId: string): Promise<ImageUpload | null> {
    return this.imageRepository.findOne({
      where: { artifactId },
      relations: ['user', 'conversation', 'message'],
    });
  }

  async getImageLocalPath(artifactId: string): Promise<string | null> {
    const image = await this.getImageByArtifactId(artifactId);
    return image?.localPath || null;
  }

  async linkImagesToMessage(artifactIds: string[], messageId: number): Promise<void> {
    // Find all images with the given artifact IDs
    const images = await this.imageRepository.find({
      where: { artifactId: In(artifactIds) },
    });
    
    // Link each image to the message
    for (const image of images) {
      image.message = { id: messageId } as any;
      await this.imageRepository.save(image);
    }
  }
}

