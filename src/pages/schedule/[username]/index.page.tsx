import { Avatar, Heading, Text } from '@ignite-ui/react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { prisma } from '../../../lib/prisma'
import { ScheduleForm } from './ScheduleForm/index.page'
import { Container, UserHeader } from './styles'

interface ScheduleProps {
  user: {
    name: string
    bio: string
    avatarUrl: string
  }
}

export default function Schedule({
  user: { avatarUrl, bio, name },
}: ScheduleProps) {
  return (
    <Container>
      <UserHeader>
        <Avatar src={avatarUrl} />
        <Heading>{name}</Heading>
        <Text>{bio}</Text>
      </UserHeader>

      <ScheduleForm />
    </Container>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = String(params?.username)

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return {
      notFound: true,
    }
  }

  const { name, bio, avatar_url: avatarUrl } = user

  console.log(avatarUrl)

  return {
    props: {
      user: {
        name,
        bio,
        avatarUrl,
      },
    },
    revalidate: 60 * 60 * 24, // 1 day
  }
}
