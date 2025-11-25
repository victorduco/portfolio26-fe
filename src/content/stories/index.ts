import { story1Content } from './story1'
import { story2Content } from './story2'
import { story3Content } from './story3'

export type MediaProps = { type: string; props: Record<string, unknown> }
export type Heading = { main: string; sectionTag?: string }
export type Section = { heading?: Heading; textBefore?: string; media?: MediaProps; textAfter?: string }
export type ContentGroup = { heading?: Heading; sections: Section[] }
export type StoryContent = Record<string, ContentGroup>

export const storiesContent: Record<string, StoryContent> = { '1': story1Content, '2': story2Content, '3': story3Content }
