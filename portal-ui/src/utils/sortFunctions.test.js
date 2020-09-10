import {policySort} from './sortFunctions';

it('policy sort', () => {
  const testCases = [
    {
      args: {
        policies: [
          {
            name: "user",
          },
          {
            name: "admin",
          },
          {
            name: "operator",
          },
          {
            name: "superadmin",
          },
          {
            name: "partner",
          },
        ]
      },
      expectedResult:  [{"name": "admin"}, {"name": "operator"}, {"name": "partner"}, {"name": "superadmin"}, {"name": "user"}],
    },
    {
      args: {
        policies: [
          {
            name: "user",
          },
          {
            name: "admin",
          },
          {
            name: "operator",
          },
          {
            name: "",
          },
        ]
      },
      expectedResult:  [{"name": ""}, {"name": "admin"}, {"name": "operator"}, {"name": "user"}],
    },
    {
      args: {
        policies: [
          {
            name: "user",
          },
          {
            name: "admin",
          },
          {
            name: "operator",
          },
          {
            name: null,
          },
        ]
      },
      expectedResult:  [{"name": "admin"}, {"name": "operator"}, {"name": "user"}, {"name": null}],
    }
  ];
  testCases.forEach((test) => {
    const policies = test.args.policies;
    const result = test.expectedResult;
    expect(policies.sort(policySort)).toEqual(result);
  })
});