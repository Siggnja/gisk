import { BlitzPage } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import { Box, Flex, Text } from "@chakra-ui/layout"
import { useTheme } from "@chakra-ui/react"
import TeamImage from "app/core/components/TeamImage"
import Layout from "app/core/layouts/Layout"
import getActiveTournament from "app/matches/queries/getActiveTournament"
import getTeams from "app/teams/queries/getTeams"
import Head from "next/head"
import Link from "next/link"
import { Suspense } from "react"
import { useTranslation } from "react-i18next"

export const TeamsList = () => {
  const [teams] = useQuery(getTeams, {})
  const { t } = useTranslation()
  const theme = useTheme()
  const [tournament] = useQuery(getActiveTournament, {})
  const groups = Array.from(
    new Set(
      teams.map(
        (t) =>
          t.teamTournaments.find((teamTourney) => teamTourney.tournamentId === tournament?.id)
            ?.group
      )
    )
  )
  const teamsByGroups = groups
    .map((group) => ({
      group,
      teams: teams.filter(
        (t) =>
          t.teamTournaments.find((teamTourney) => teamTourney.tournamentId === tournament?.id)
            ?.group
      ),
    }))
    .sort((firstGroup, secondGroup) => {
      if (!firstGroup.group || !secondGroup.group) return 0

      return firstGroup.group?.localeCompare(secondGroup.group)
    })

  return (
    <Flex
      direction="row"
      flexWrap="wrap"
      alignItems="center"
      justifyContent="center"
      maxW={"700px"}
      mx="auto"
      pb={4}
    >
      {teamsByGroups.map((group) => (
        <Flex
          width="200px"
          key={group.group}
          p={4}
          mr={5}
          mt={5}
          border={`2px solid ${theme.colors.primary}`}
          borderRadius={"20px"}
          height="290px"
          direction="column"
        >
          <Text
            fontSize="2xl"
            fontWeight="bold"
            mb={4}
            textAlign="center"
            borderBottom={`1px solid ${theme.colors.primary}`}
          >
            {`${t("GROUP")} ${group.group}`}
          </Text>
          <Flex flex="1" direction="column" justifyContent="space-between">
            {group.teams.map((team) => (
              <Flex
                cursor="pointer"
                direction="row"
                key={team.id}
                alignItems="center"
                _hover={{
                  backgroundColor: "gray.100",
                }}
              >
                <TeamImage team={team} />
                <Box ml={2}>
                  <Link href={`/teams/${team.name}`}>
                    <Text>
                      {team.name} ({team.countryCode})
                    </Text>
                  </Link>
                </Box>
              </Flex>
            ))}
          </Flex>
        </Flex>
      ))}
    </Flex>
  )
}

const TeamsPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Teams</title>
      </Head>

      <div>
        <Suspense fallback={<div></div>}>
          <TeamsList />
        </Suspense>
      </div>
    </>
  )
}

TeamsPage.authenticate = true
TeamsPage.getLayout = (page) => <Layout>{page}</Layout>

export default TeamsPage
