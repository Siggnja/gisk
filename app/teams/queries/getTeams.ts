import { resolver } from "@blitzjs/rpc"
import db from "db"

export default resolver.pipe(resolver.authorize(), async () => {
  const teams = await (
    await db.team.findMany({
      include: {
        teamTournaments: true,
      },
    })
  ).sort((first, second) => first.name.localeCompare(second.name))
  return teams
})
