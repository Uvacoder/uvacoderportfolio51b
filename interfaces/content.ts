import { ResponsiveImageType } from 'react-datocms'

export type Article = {
  date: Date | string
  tags?: string
  slug?: string
  content?: string
  id?: string
  thumbnail?: {
    alt: string
    blurhash: string
    title: string
    responsiveImage: ResponsiveImageType
  }
  title: string
}

export type Project = {
  id: string
  title: string
  tags?: string
  thumbnail?: {
    alt: string
    blurhash: string
    title: string
    responsiveImage: ResponsiveImageType
  }
  caseStudy: string
  date: Date | string
  slug: string
  link: string
}

export interface ArticleProps {
  data: {
    article: Article
    moreArticles: Article[]
  }
}

export interface BlogPosts {
  data: {
    allArticles: Article[]
  }
}

export type WorkProps = {
  data: {
    allProjects: Project[]
  }
}

export type AllArticles = { allArticles: Article[] }
export type AllProjects = { allProjects: Project[] }

export interface List {
  data: AllArticles | AllProjects
  type: 'allProjects' | 'allArticles'
  columns: '2' | '3' | '4'
}
