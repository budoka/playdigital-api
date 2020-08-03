/**
 * Get the error message parsed from the foreign key constraint.
 * @param message Full error message.
 */
export function getConstraintErrorMessage(message: string) {
  const regex = new RegExp(/FOREIGN KEY \(`(.+?)`\)/g);
  const match = regex.exec(message);
  return match ? `${match[1]} is not a valid value` : 'Some property or value is incorrect, please try again.';
}
