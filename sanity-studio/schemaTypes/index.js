// schemas/index.js
import newsPost from './newsPost'
import confession from './confession'
import { bannedUser } from './bannedUsers'

import userProfile from './userProfile'
import product from './product'
import review from './review'
import conversation from './conversation'
import transaction from './transaction'
import report from './report'

export const schemaTypes = [newsPost, confession, bannedUser, userProfile, product, review, conversation, transaction, report]