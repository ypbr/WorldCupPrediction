// FIFA 2026 World Cup - All 48 teams organized by group
// Each team: { id, name, iso2, group, confederation }
// iso2: ISO 3166-1 alpha-2 lowercase code used by flagcdn.com

export const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

export const TEAMS = [
    // Group A
    { id: 'MEX', name: 'Mexico', iso2: 'mx', group: 'A', confederation: 'CONCACAF', host: true },
    { id: 'RSA', name: 'South Africa', iso2: 'za', group: 'A', confederation: 'CAF' },
    { id: 'KOR', name: 'South Korea', iso2: 'kr', group: 'A', confederation: 'AFC' },
    { id: 'CZE', name: 'Czech Rep.', iso2: 'cz', group: 'A', confederation: 'UEFA' },

    // Group B
    { id: 'CAN', name: 'Canada', iso2: 'ca', group: 'B', confederation: 'CONCACAF', host: true },
    { id: 'BIH', name: 'Bosnia & Herz.', iso2: 'ba', group: 'B', confederation: 'UEFA' },
    { id: 'QAT', name: 'Qatar', iso2: 'qa', group: 'B', confederation: 'AFC' },
    { id: 'SUI', name: 'Switzerland', iso2: 'ch', group: 'B', confederation: 'UEFA' },

    // Group C
    { id: 'BRA', name: 'Brazil', iso2: 'br', group: 'C', confederation: 'CONMEBOL' },
    { id: 'MAR', name: 'Morocco', iso2: 'ma', group: 'C', confederation: 'CAF' },
    { id: 'HAI', name: 'Haiti', iso2: 'ht', group: 'C', confederation: 'CONCACAF' },
    { id: 'SCO', name: 'Scotland', iso2: 'gb-sct', group: 'C', confederation: 'UEFA' },

    // Group D
    { id: 'USA', name: 'USA', iso2: 'us', group: 'D', confederation: 'CONCACAF', host: true },
    { id: 'PAR', name: 'Paraguay', iso2: 'py', group: 'D', confederation: 'CONMEBOL' },
    { id: 'AUS', name: 'Australia', iso2: 'au', group: 'D', confederation: 'AFC' },
    { id: 'TUR', name: 'Turkey', iso2: 'tr', group: 'D', confederation: 'UEFA' },

    // Group E
    { id: 'GER', name: 'Germany', iso2: 'de', group: 'E', confederation: 'UEFA' },
    { id: 'CUW', name: 'Curaçao', iso2: 'cw', group: 'E', confederation: 'CONCACAF' },
    { id: 'CIV', name: 'Ivory Coast', iso2: 'ci', group: 'E', confederation: 'CAF' },
    { id: 'ECU', name: 'Ecuador', iso2: 'ec', group: 'E', confederation: 'CONMEBOL' },

    // Group F
    { id: 'NED', name: 'Netherlands', iso2: 'nl', group: 'F', confederation: 'UEFA' },
    { id: 'JPN', name: 'Japan', iso2: 'jp', group: 'F', confederation: 'AFC' },
    { id: 'SWE', name: 'Sweden', iso2: 'se', group: 'F', confederation: 'UEFA' },
    { id: 'TUN', name: 'Tunisia', iso2: 'tn', group: 'F', confederation: 'CAF' },

    // Group G
    { id: 'BEL', name: 'Belgium', iso2: 'be', group: 'G', confederation: 'UEFA' },
    { id: 'EGY', name: 'Egypt', iso2: 'eg', group: 'G', confederation: 'CAF' },
    { id: 'IRN', name: 'Iran', iso2: 'ir', group: 'G', confederation: 'AFC' },
    { id: 'NZL', name: 'New Zealand', iso2: 'nz', group: 'G', confederation: 'OFC' },

    // Group H
    { id: 'ESP', name: 'Spain', iso2: 'es', group: 'H', confederation: 'UEFA' },
    { id: 'CPV', name: 'Cape Verde', iso2: 'cv', group: 'H', confederation: 'CAF' },
    { id: 'KSA', name: 'Saudi Arabia', iso2: 'sa', group: 'H', confederation: 'AFC' },
    { id: 'URU', name: 'Uruguay', iso2: 'uy', group: 'H', confederation: 'CONMEBOL' },

    // Group I
    { id: 'FRA', name: 'France', iso2: 'fr', group: 'I', confederation: 'UEFA' },
    { id: 'SEN', name: 'Senegal', iso2: 'sn', group: 'I', confederation: 'CAF' },
    { id: 'IRQ', name: 'Iraq', iso2: 'iq', group: 'I', confederation: 'AFC' },
    { id: 'NOR', name: 'Norway', iso2: 'no', group: 'I', confederation: 'UEFA' },

    // Group J
    { id: 'ARG', name: 'Argentina', iso2: 'ar', group: 'J', confederation: 'CONMEBOL' },
    { id: 'ALG', name: 'Algeria', iso2: 'dz', group: 'J', confederation: 'CAF' },
    { id: 'AUT', name: 'Austria', iso2: 'at', group: 'J', confederation: 'UEFA' },
    { id: 'JOR', name: 'Jordan', iso2: 'jo', group: 'J', confederation: 'AFC' },

    // Group K
    { id: 'POR', name: 'Portugal', iso2: 'pt', group: 'K', confederation: 'UEFA' },
    { id: 'COD', name: 'DR Congo', iso2: 'cd', group: 'K', confederation: 'CAF' },
    { id: 'UZB', name: 'Uzbekistan', iso2: 'uz', group: 'K', confederation: 'AFC' },
    { id: 'COL', name: 'Colombia', iso2: 'co', group: 'K', confederation: 'CONMEBOL' },

    // Group L
    { id: 'ENG', name: 'England', iso2: 'gb-eng', group: 'L', confederation: 'UEFA' },
    { id: 'CRO', name: 'Croatia', iso2: 'hr', group: 'L', confederation: 'UEFA' },
    { id: 'GHA', name: 'Ghana', iso2: 'gh', group: 'L', confederation: 'CAF' },
    { id: 'PAN', name: 'Panama', iso2: 'pa', group: 'L', confederation: 'CONCACAF' },
]

/** Return the 4 teams for a given group letter */
export function getGroupTeams(groupLetter) {
    return TEAMS.filter(t => t.group === groupLetter)
}

/** Return team object by id */
export function getTeamById(id) {
    return TEAMS.find(t => t.id === id) ?? null
}
