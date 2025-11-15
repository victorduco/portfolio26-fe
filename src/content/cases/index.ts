import { case1Content } from './case1'
import { case2Content } from './case2'
import { case3Content } from './case3'

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

export interface CaseContent {
  [key: string]: ContentGroup
}

export const casesContent: Record<string, CaseContent> = {
  '1': case1Content,
  '2': case2Content,
  '3': case3Content,
}
