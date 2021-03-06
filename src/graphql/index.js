import { gql, makeExecutableSchema } from 'apollo-server';
import merge from 'lodash.merge';
import account from './account';
import AuthenticatedDirective from './directives/authenticated';
import createHasRoleDirective from './directives/has-role';
import createHasPermissionDirective from './directives/has-permission';

const defaultTypeDefs = gql`
  directive @authenticated on OBJECT | FIELD_DEFINITION
  directive @hasRole(role: String!) on OBJECT | FIELD_DEFINITION
  directive @hasPermission(permission: String!) on OBJECT | FIELD_DEFINITION

  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`;

const createSchema = (context) =>
  makeExecutableSchema({
    typeDefs: [defaultTypeDefs, account.typeDefs],
    resolvers: merge({}, account.resolvers),
    schemaDirectives: {
      authenticated: AuthenticatedDirective,
      hasRole: createHasRoleDirective(context.services.role),
      hasPermission: createHasPermissionDirective(
        context.services.role,
        context.services.permission,
      ),
    },
  });

export default createSchema;
