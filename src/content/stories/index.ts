import { story1Content } from './story1'
import { story2Content } from './story2'
import { story3Content } from './story3'

export interface Heading {
  main: string
  subtitle?: string
}

export interface MediaProps {
  type: 'image' | 'video' | 'parallax' | 'chaptered-video' | 'layered-cards'
  props: Record<string, any>
}

export interface Section {
  heading?: Heading
  textBefore?: string
  media?: MediaProps
  textAfter?: string
}

export interface ContentGroup {
  heading?: Heading
  sections: Section[]
}

export interface StoryContent {
  [key: string]: ContentGroup
}

export const storiesContent: Record<string, StoryContent> = {
  '1': story1Content,
  '2': story2Content,
  '3': story3Content,
}
