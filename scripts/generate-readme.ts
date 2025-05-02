import fs from 'node:fs'
import path from 'node:path'
import glob from 'glob'

interface RouteInfo {
  method: string
  path: string
  summary?: string
  description?: string
  tags?: string[]
}

async function extractRoutesFromFile(filePath: string): Promise<RouteInfo[]> {
  const content = fs.readFileSync(filePath, 'utf-8')
  const routes: RouteInfo[] = []

  // Match route definitions
  const routeRegex = /app\.(get|post|put|delete|patch)\(['"`]([^'`"]+)['"`]/g
  const schemaRegex = /schema:\s*{([^}]+)}/g

  let match: RegExpExecArray | null
  while (true) {
    match = routeRegex.exec(content)
    if (match === null) break

    const method = match[1].toUpperCase()
    const path = match[2]

    // Find schema for this route
    const schemaMatch = content.slice(match.index).match(schemaRegex)
    let summary = ''
    let description = ''
    let tags: string[] = []

    if (schemaMatch) {
      const schemaContent = schemaMatch[0]
      const summaryMatch = schemaContent.match(/summary:\s*['"`]([^'`"]+)['"`]/)
      const descriptionMatch = schemaContent.match(
        /description:\s*['"`]([^'`"]+)['"`]/
      )
      const tagsMatch = schemaContent.match(/tags:\s*\[([^\]]+)\]/)

      if (summaryMatch) summary = summaryMatch[1]
      if (descriptionMatch) description = descriptionMatch[1]
      if (tagsMatch)
        tags = tagsMatch[1]
          .split(',')
          .map(tag => tag.trim().replace(/['"`]/g, ''))
    }

    routes.push({
      method,
      path,
      summary,
      description,
      tags,
    })
  }

  return routes
}

function groupRoutesByTag(routes: RouteInfo[]): Record<string, RouteInfo[]> {
  const grouped: Record<string, RouteInfo[]> = {}

  for (const route of routes) {
    const tag = route.tags?.[0] || 'other'
    if (!grouped[tag]) {
      grouped[tag] = []
    }
    grouped[tag].push(route)
  }

  return grouped
}

function generateMarkdown(groupedRoutes: Record<string, RouteInfo[]>): string {
  let markdown = '## API Endpoints\n\n'

  for (const [tag, routes] of Object.entries(groupedRoutes)) {
    const title = tag.charAt(0).toUpperCase() + tag.slice(1)
    markdown += `### ${title}\n\n`

    for (const route of routes) {
      markdown += `- \`${route.method} ${route.path}\`\n`
      if (route.summary) {
        markdown += `  - ${route.summary}\n`
      }
      if (route.description) {
        markdown += `  - ${route.description}\n`
      }
    }

    markdown += '\n'
  }

  return markdown
}

async function updateReadme() {
  try {
    // Find all route files
    const routeFiles = await new Promise<string[]>((resolve, reject) => {
      glob('src/route/**/*.ts', (err, matches) => {
        if (err) reject(err)
        else resolve(matches)
      })
    })

    // Extract routes from each file
    const allRoutes: RouteInfo[] = []
    for (const file of routeFiles) {
      const routes = await extractRoutesFromFile(file)
      allRoutes.push(...routes)
    }

    // Group routes by tag
    const groupedRoutes = groupRoutesByTag(allRoutes)

    // Generate markdown
    const newContent = generateMarkdown(groupedRoutes)

    // Read current README
    const readmePath = path.join(process.cwd(), 'README.md')
    let readmeContent = fs.readFileSync(readmePath, 'utf-8')

    // Replace API Endpoints section
    const startMarker = '## API Endpoints'
    const endMarker = '## CORS Configuration'
    const startIndex = readmeContent.indexOf(startMarker)
    const endIndex = readmeContent.indexOf(endMarker)

    if (startIndex !== -1 && endIndex !== -1) {
      const before = readmeContent.substring(0, startIndex)
      const after = readmeContent.substring(endIndex)
      readmeContent = before + newContent + after

      // Write updated README
      fs.writeFileSync(readmePath, readmeContent)
      console.log('README.md updated successfully!')
    } else {
      console.error('Could not find API Endpoints section in README.md')
    }
  } catch (error) {
    console.error('Error updating README:', error)
  }
}

// Run the update
updateReadme()
