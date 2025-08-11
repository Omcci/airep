import { IsString, IsNotEmpty, IsEnum, IsOptional, Length, IsUrl, Matches, Transform } from 'class-validator'
import { Transform as TransformDecorator } from 'class-transformer'

export enum Platform {
  LINKEDIN = 'linkedin',
  TWITTER = 'twitter',
  BLOG = 'blog',
  EMAIL = 'email'
}

export enum ContentType {
  CONTENT = 'content',
  URL = 'url'
}

export class AIAnalysisRequestDto {
  @IsNotEmpty({ message: 'Content is required' })
  @IsString({ message: 'Content must be a string' })
  @Length(10, 10000, { 
    message: 'Content must be between 10 and 10,000 characters' 
  })
  @TransformDecorator(({ value }) => {
    if (typeof value === 'string') {
      return value.trim()
    }
    return value
  })
  @Matches(/^[\x20-\x7E\n\r\t]*$/, { 
    message: 'Content contains invalid characters' 
  })
  content: string

  @IsNotEmpty({ message: 'Platform is required' })
  @IsEnum(Platform, { 
    message: 'Platform must be one of: linkedin, twitter, blog, email' 
  })
  platform: Platform

  @IsNotEmpty({ message: 'Content type is required' })
  @IsEnum(ContentType, { 
    message: 'Content type must be either "content" or "url"' 
  })
  contentType: ContentType

  @IsOptional()
  @IsUrl({}, { message: 'URL must be a valid URL format' })
  @Length(10, 2048, { message: 'URL must be between 10 and 2048 characters' })
  url?: string

  // Business logic validation
  @TransformDecorator(({ obj }) => {
    // If content type is URL, content should be shorter (it's the URL)
    if (obj.contentType === ContentType.URL) {
      if (obj.content.length > 2048) {
        throw new Error('URL content is too long (max 2048 characters)')
      }
    }
    
    // If content type is CONTENT, apply platform-specific length requirements
    if (obj.contentType === ContentType.CONTENT) {
      const platformLimits = {
        [Platform.LINKEDIN]: { min: 20, max: 3000 },
        [Platform.TWITTER]: { min: 10, max: 280 },
        [Platform.BLOG]: { min: 50, max: 10000 },
        [Platform.EMAIL]: { min: 30, max: 5000 }
      }
      
      const limits = platformLimits[obj.platform]
      if (obj.content.length < limits.min) {
        throw new Error(`${obj.platform} content must be at least ${limits.min} characters`)
      }
      if (obj.content.length > limits.max) {
        throw new Error(`${obj.platform} content cannot exceed ${limits.max} characters`)
      }
    }
    
    return obj.content
  })
  validatedContent: string
}

export class SecurityCheckRequestDto {
  @IsNotEmpty({ message: 'Content is required' })
  @IsString({ message: 'Content must be a string' })
  @Length(1, 10000, { message: 'Content must be between 1 and 10,000 characters' })
  @TransformDecorator(({ value }) => {
    if (typeof value === 'string') {
      return value.trim()
    }
    return value
  })
  content: string

  @IsNotEmpty({ message: 'Platform is required' })
  @IsEnum(Platform, { 
    message: 'Platform must be one of: linkedin, twitter, blog, email' 
  })
  platform: Platform
}

export class RateLimitRequestDto {
  @IsNotEmpty({ message: 'User identifier is required' })
  @IsString({ message: 'User identifier must be a string' })
  @Length(1, 100, { message: 'User identifier must be between 1 and 100 characters' })
  userId: string

  @IsNotEmpty({ message: 'Request type is required' })
  @IsString({ message: 'Request type must be a string' })
  @Matches(/^(analyze|security-check|optimize)$/, { 
    message: 'Request type must be: analyze, security-check, or optimize' 
  })
  requestType: string

  @IsOptional()
  @IsString({ message: 'IP address must be a string' })
  @Matches(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^[0-9a-fA-F:]+$/, { 
    message: 'IP address format is invalid' 
  })
  ipAddress?: string
}
