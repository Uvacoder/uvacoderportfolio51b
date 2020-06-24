import { fetchAPI } from '@/lib/datocms'
import { ARTICLE_QUERY, ALL_ARTICLES_QUERY } from '../../graphql/queries/posts'
import Head from '@/components/header'
import processMarkdown from '@/lib/processMarkdown'
import Container from '@/components/container'
import Navbar from '@/components/navbar'
import { ArticleProps } from '@/interfaces/blog'

import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import ErrorPage from 'next/error'

export default function Article({ data }: ArticleProps) {
  const router = useRouter()
  if (!router?.isFallback && !data?.article?.slug) {
    return <ErrorPage statusCode={404} />
  }
  return (
    <div>
      <Head title={data?.article?.title} />
      <Navbar />
      <Container>
        <div className="w-full md:w-3/4 mx-auto">
          <h1 data-testid="title" className="text-5xl font-bold mb-5">
            {data?.article?.title}
          </h1>
          <small data-testid="date">
            {dayjs(data?.article?.date).format('DD MMM, YYYY')}
          </small>
          <div
            data-testid="content"
            className="content"
            dangerouslySetInnerHTML={{ __html: data?.article?.content }}
          />
        </div>
      </Container>
    </div>
  )
}

// istanbul ignore next line
export async function getStaticProps({ params }) {
  const result = await fetchAPI(ARTICLE_QUERY, {
    variables: { slug: params.slug },
    preview: true,
  })
  return {
    props: {
      data: {
        ...result,
        article: {
          ...result.article,
          content: await processMarkdown(result.article.content),
        },
      },
    },
  }
}

// istanbul ignore next line
export async function getStaticPaths() {
  const data = await fetchAPI(ALL_ARTICLES_QUERY)
  return {
    paths: data?.allArticles?.map((article) => `/blog/${article.slug}`) || [],
    fallback: true,
  }
}