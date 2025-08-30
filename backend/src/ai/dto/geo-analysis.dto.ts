import { IsString, IsNotEmpty, IsEnum, Length } from 'class-validator'
import { Transform } from 'class-transformer'

export enum ContentType {
    ARTICLE = 'article',
    DOCUMENTATION = 'documentation',
    TOOL = 'tool',
    API = 'api'
}

export class GEOAnalysisRequestDto {
    @IsNotEmpty({ message: 'Content is required' })
    @IsString({ message: 'Content must be a string' })
    @Length(10, 10000, {
        message: 'Content must be between 10 and 10,000 characters'
    })
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            return value.trim()
        }
        return value
    })
    content: string

    @IsNotEmpty({ message: 'Content type is required' })
    @IsEnum(ContentType, {
        message: 'Content type must be one of: article, documentation, tool, api'
    })
    contentType: ContentType
}
