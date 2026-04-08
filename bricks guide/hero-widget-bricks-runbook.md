# Hero + Search Widget Bricks Runbook for Nono Mags

## Goal

This runbook shows exactly how to build the homepage hero and the right-column search widget in Bricks, using the current `App.tsx` structure as the source.

React source anchors:

- Hero section: `src/app/App.tsx:984`
- Hero copy: `src/app/App.tsx:993`
- Hero widget mount: `src/app/App.tsx:1010`
- Hero widget component: `src/app/App.tsx:273`

This runbook supports two widget paths:

1. safe visual shell only
2. prototype redirect widget using the existing `rego-search.php`

Use path 1 unless you intentionally want the prototype redirect behavior.

## Guardrails

- Bricks version assumed: `2.3+`
- Homepage is assumed to already be the static front page
- Header and footer are assumed to already be handled separately
- Do not implement real rego lookup logic here
- Do not treat `?rego=` or `?tyre_size=` as production-ready filtering
- Do not paste JavaScript unless you accept Bricks Code-element review/signing

Sources:

- Bricks HTML & CSS to Bricks: https://academy.bricksbuilder.io/article/html-css-to-bricks/
- Bricks Custom Code: https://academy.bricksbuilder.io/article/custom-code/
- Bricks Layout: https://academy.bricksbuilder.io/article/layout/
- Bricks Section element: https://academy.bricksbuilder.io/article/section-element/
- Bricks Container element: https://academy.bricksbuilder.io/article/container-element/
- Bricks Block element: https://academy.bricksbuilder.io/article/block-element/
- Bricks Responsive editing: https://academy.bricksbuilder.io/article/responsive-editing/
- Bricks Page settings: https://academy.bricksbuilder.io/article/page-settings/
- Bricks Accessibility: https://academy.bricksbuilder.io/article/accessibility/

## What You Need Open

Keep these open side by side:

- the `Home` page in Bricks
- [bricks-copy-paste-guides.md](C:/Users/Nathes2/Desktop/Nono%20Mags/Redesign%20landing%20page/bricks%20guide/bricks-copy-paste-guides.md)
- `wordpress-theme/nonomags-child/rego-search.php` if you want the prototype widget path

## Phase 1: Confirm the Paste Workflow

1. In WordPress admin, go to `Bricks > Settings > Builder`.
2. Confirm `HTML & CSS to Bricks` is enabled.
3. Use `Enabled (confirm on paste)` if you want to inspect every paste action.
4. Save settings if you changed anything.

Expected result:

- Bricks can convert pasted HTML/CSS into native elements, classes, and variables.

## Phase 2: Open the Homepage and Clear the Working Area

1. Open the `Home` page in Bricks.
2. Find the first page-body section position under the header.
3. If the homepage is empty, keep the canvas ready for a fresh first section.
4. If the homepage already has draft sections, identify where the hero should sit at the top of the page body.

Expected result:

- You are ready to build the hero as the first root section inside the page body.

## Phase 3: Create the Hero Section Structure

Manual Builder path:

1. Add a root `Section`.
2. Keep the default `Container` that Bricks inserts.
3. Inside the container, add two sibling `Block` elements.
4. Treat the left block as `hero copy`.
5. Treat the right block as `hero widget`.

Recommended structure:

- `Section`
- `Container`
- `Block` left
- `Block` right

Why:

- Bricks recommends `Section`, `Container`, and `Block` as the default layout pattern.
- `Block` is the easiest way to create full-width columns inside a section/container layout.

## Phase 4: Style the Hero Section Container

Click the root hero `Section` and set these first:

1. Layout:
   - width stays full
   - direction stays vertical at the section level
2. Spacing:
   - top padding: generous hero spacing
   - bottom padding: generous hero spacing
3. Minimum height:
   - set enough vertical space so the hero feels intentional above the fold
4. Background:
   - start with a dark brand background
   - then add the real hero image from the Media Library
5. Overlay:
   - add a dark overlay or gradient so white text stays readable

Closest React visual intent:

- dark base background
- background image underlay
- dark left-to-right overlay for readability
- roomy vertical spacing

`Inference:` a minimum height around the React prototype's `640px` visual intent is reasonable, but you should tune it inside Bricks based on the final background image and header height.

## Phase 5: Configure the Two-Column Hero Layout

Click the `Container` inside the hero and set:

1. Layout direction so the child blocks sit side by side on desktop/base.
2. Horizontal gap between the two blocks.
3. Vertical alignment so copy and widget feel centered together.
4. Full width usage inside the contained area.

Then click each `Block`:

Left block:

1. Let it grow naturally.
2. Keep it as the content column.

Right block:

1. Keep it constrained enough that the widget reads as a card, not a full-width panel.
2. Align it so it sits cleanly on the right on desktop/base.

Expected result:

- desktop/base shows copy left and widget right
- smaller breakpoints will stack later

## Phase 6: Add the Hero Copy

Inside the left block, add these elements in order:

1. Text or basic text element for the pill/eyebrow
2. Heading element for the `H1`
3. Text element for the supporting paragraph
4. A small row/wrap of proof items

Use this content from the current React homepage:

Pill:

- `Rated #1 Tyre Network in NZ`

H1:

- `Get the Right Tyres. Guaranteed.`

Support paragraph:

- `Enter your rego and we'll show you the exact tyres for your car. Shipped directly to your local fitter or right to your door.`

Proof row:

- `Free Shipping`
- `200+ Fitters`

Builder notes:

1. Keep this section to one clear `H1`.
2. Use a real button style only if you add a CTA here later.
3. Make sure the text stays readable against the background image.

## Phase 7: Choose the Widget Build Path

### Path A: Safe visual shell only

Use this if you want the homepage to look complete without claiming the search behavior works yet.

1. Open [bricks-copy-paste-guides.md](C:/Users/Nathes2/Desktop/Nono%20Mags/Redesign%20landing%20page/bricks%20guide/bricks-copy-paste-guides.md).
2. Find `Snippet 2: Hero Shell With Static Search Widget Shell`.
3. Copy only the widget structure if you are building the hero manually, or copy the full hero snippet if you want Bricks to generate the whole structure from paste.
4. Click the hero right block.
5. Paste the widget shell.
6. Review the generated elements and remove any wrappers you do not need.

Expected result:

- the widget looks like a real search panel
- the tabs and button are visual only
- no rego or tyre-size logic is implied

### Path B: Prototype redirect widget

Use this only if you knowingly want the current prototype behavior.

1. Open `wordpress-theme/nonomags-child/rego-search.php`.
2. Copy the prototype markup and script.
3. Click the hero right block in Bricks.
4. Paste the code.
5. Bricks will route the script into a Code element for review/signing.
6. Review the Code element carefully before saving.
7. Keep a note that this path only redirects with query strings and does not complete the backend integration.

Expected result:

- tabs switch
- rego path redirects to `/shop/?rego=...`
- size path redirects to `/shop/?tyre_size=...`

Limitations:

- no confirmed rego lookup source
- no confirmed WordPress parser for those query params
- no confirmed shop filtering behavior

## Phase 8: Style the Widget Card

Whether you choose the shell or prototype path, the widget should read like a contained card.

Click the outer widget wrapper and set:

1. White or surface background
2. Rounded corners
3. Card shadow
4. Overflow hidden
5. Comfortable internal padding for the body

Then style these inner parts:

Tabs row:

1. light surface background
2. two equal tab buttons
3. active state with orange top border or active-color cue

Input/select area:

1. strong label clarity
2. high-contrast border
3. generous height
4. readable placeholder text

Button:

1. orange primary button styling
2. full width
3. strong weight and contrast

Accessibility note:

- keep a visible label for the rego input if you are using the visual shell
- keep focus styles visible

## Phase 9: Replace the Background With the Final Image

Once layout and readability are stable:

1. Click the hero section.
2. Open background controls.
3. Replace the temporary dark fill with the real Media Library image.
4. Keep a dark overlay or gradient on top of the image.
5. Check that the `H1`, paragraph, and proof row still read clearly.

Do not leave the final hero image as an external hotlink if this is going live.

## Phase 10: Run the Responsive Pass

Open Bricks responsive editing and check the hero at smaller breakpoints.

1. Finish desktop/base first.
2. Switch to `Tablet portrait`.
3. Switch to `Mobile landscape`.
4. Switch to `Mobile portrait`.

At each breakpoint verify:

1. hero columns stack to one column when needed
2. widget does not overflow horizontally
3. hero copy does not become too wide for easy reading
4. proof row wraps cleanly
5. widget tabs remain readable and tappable
6. input/select controls remain full width and usable

Likely responsive adjustments:

- container direction: side by side to stacked
- reduced section padding on mobile
- reduced gap between copy and widget
- slightly smaller hero heading at smaller breakpoints

## Phase 11: Final Page-Level Checks

Before you move on to the next homepage section:

1. Confirm there is still only one `H1` on the page.
2. Confirm the widget labels are visible or intentionally handled accessibly.
3. Confirm the background image and overlays do not hide text contrast.
4. Confirm the page still uses the homepage metadata/social settings you want in `Page Settings`.
5. If you used the prototype widget path, leave a note for yourself that the behavior is still provisional.

## Stop Here If Any of These Are Still Unknown

Do not treat the widget as production-ready if any of these remain unresolved:

- rego lookup data source
- WordPress handling for `?rego=`
- WordPress handling for `?tyre_size=`
- WooCommerce/shop query logic
- fitment validation logic

If those are still unknown, the correct result is:

- ship the hero visual shell only, or
- keep the widget as a clearly provisional prototype

## Related Files

- [bricks-implementation-strategy.md](C:/Users/Nathes2/Desktop/Nono%20Mags/Redesign%20landing%20page/bricks%20guide/bricks-implementation-strategy.md)
- [homepage-bricks-build-checklist.md](C:/Users/Nathes2/Desktop/Nono%20Mags/Redesign%20landing%20page/bricks%20guide/homepage-bricks-build-checklist.md)
- [bricks-copy-paste-guides.md](C:/Users/Nathes2/Desktop/Nono%20Mags/Redesign%20landing%20page/bricks%20guide/bricks-copy-paste-guides.md)

