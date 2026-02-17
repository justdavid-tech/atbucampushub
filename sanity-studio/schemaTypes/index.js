// schemas/index.js
import newsPost from './newsPost'
import confession from './confession'
import { bannedUser } from './bannedUsers'

export const schemaTypes = [newsPost, confession, bannedUser]