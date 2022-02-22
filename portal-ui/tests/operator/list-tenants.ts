import { diagnosticsElement, supportElement } from "../utils/elements-menu";
import { Selector } from 'testcafe';


fixture("For user with default permissions").page("http://localhost:9090");

test("Create Tenant", async (t) => {

	const osCount = Selector(`#root > div > main > div[class] > div > div > div > div:nth-child(1) > div > div > div`).count;

	await t
		.navigateTo("http://localhost:9090/login")
		.typeText("#jwt","anyrandompasswordwillwork")
		.click("button.MuiButton-root")
		.click(Selector('button[tabindex="0"][type="button"]').withText('Create Tenant'))
		.typeText("#tenant-name","thufeb1754epm")
		.typeText("#namespace","default")
		.wait(2000)
		.click("button[tabindex=\"0\"]:nth-of-type(2)")
		.click(Selector('button[tabindex="0"][type="button"]').withText('Done'))
		.expect(osCount).eql(2);

});
