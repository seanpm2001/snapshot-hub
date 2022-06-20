import graphqlFields from 'graphql-fields';
import {
  fetchSpaces,
  addRelatedSpaces,
  PublicError,
  needsFetchRelatedSpaces,
  checkRelatedSpacesNesting
} from '../helpers';

export default async function(_parent, { id }, _context, info) {
  if (!id) return new PublicError('Missing id');
  try {
    let spaces = await fetchSpaces({ first: 1, where: { id } });
    if (spaces.length !== 1) return null;

    const requestedFields = info ? graphqlFields(info) : {};
    if (needsFetchRelatedSpaces(requestedFields)) {
      checkRelatedSpacesNesting(requestedFields);
      spaces = await addRelatedSpaces(spaces);
    }

    return spaces[0];
  } catch (e) {
    console.log('[graphql]', e);
    if (e instanceof PublicError) return e;
    return new Error('Unexpected error');
  }
}
