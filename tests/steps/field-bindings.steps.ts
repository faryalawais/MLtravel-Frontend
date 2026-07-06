import { createBdd, test } from 'playwright-bdd';

const { Given, When, Then } = createBdd(test);

// CP-002 has no field.* binding scenarios. Shared field-binding steps live here
// when features need `` `field.…` is displayed in `component.…` `` assertions.

Given('field bindings are not used on this feature', () => {
  // Placeholder so field-bindings.steps.ts is a valid step module.
});

void Given;
void When;
void Then;
