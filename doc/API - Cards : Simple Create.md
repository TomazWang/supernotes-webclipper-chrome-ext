```
https://api.supernotes.app/v1/cards/simple
```
# [Simple Create Card API](https://developer.supernotes.app/api-reference/cards/simple-create-card)

## Description
Create a single card with the minimum amount of data required.

## Endpoint
`POST /v1/cards/simple`

## Authorizations
- **Api-Key**: `string` (header, required)

## Request Body
- **Content-Type**: `application/json`

### Parameters
- **name**: `string` (required) - The name of the card.
- **markup**: `string` (required) - The markup content of the card.
- **color**: `enum<string> | null` - The color of the card.
  - Available options: `blue`, `green`, `orange`, `pink`, `purple`, `red`, `yellow`
- **icon**: `string | null` - The icon of the card.
- **tags**: `string[]` - A list of tags associated with the card.
- **parent_ids**: `string[]` - A list of parent IDs for the card.
- **source**: `string | null` - The source of the card.

## Response
- **Status**: `200 OK`
- **Content-Type**: `application/json`

### Response Body
- **data**: `object` (required)
  - **data.id**: `string` (required)
  - **data.owner_id**: `string` (required)
  - **data.name**: `string` (required)
  - **data.markup**: `string` (required)
  - **data.html**: `string` (required)
  - **data.ydoc**: `string` (required)
  - **data.icon**: `string | null` (required)
  - **data.tags**: `string[]` (required)
  - **data.color**: `enum<string> | null` (required)
    - Available options: `blue`, `green`, `orange`, `pink`, `purple`, `red`, `yellow`
  - **data.created_when**: `string` (required)
  - **data.modified_when**: `string` (required)
  - **data.modified_by_id**: `string` (required)
  - **data.synced_when**: `string` (required)
  - **data.meta**: `object` (required)
  - **data.targeted_when**: `string | null` (required)
  - **data.comment_count**: `integer` (required)
  - **data.likes**: `integer` (required)
  - **data.member_count**: `integer` (required)
  - **data.public_child_count**: `integer` (required)

- **membership**: `object` (required)
  - **membership.id**: `string` (required)
  - **membership.liked**: `boolean | null` (required)
  - **membership.personal_tags**: `string[]` (required)
  - **membership.personal_color**: `enum<string> | null` (required)
    - Available options: `blue`, `green`, `orange`, `pink`, `purple`, `red`, `yellow`
  - **membership.perms**: `enum<integer>` (required)
    - Available options: `-1`, `0`, `1318`, `1382`, `1398`, `4094`, `8190`
  - **membership.via_type**: `enum<integer>` (required)
    - Available options: `0`, `1`, `2`, `3`
  - **membership.via_id**: `string | null` (required)
  - **membership.created_when**: `string` (required)
  - **membership.modified_when**: `string` (required)
  - **membership.enrolled_when**: `string | null` (required)
  - **membership.opened_when**: `string | null` (required)
  - **membership.auto_publish_children**: `boolean | null` (required)
  - **membership.view**: `object | null` (required)
    - **membership.visibility**: `enum<integer>` (required)
      - Available options: `-1`, `0`, `1`
    - **membership.status**: `enum<integer>` (required)
      - Available options: `-2`, `-1`, `0`, `1`, `2`
    - **membership.total_child_count**: `integer` (required)

- **backlinks**: `string[]` (required)

- **parents**: `object` (required)
  - **parents.[card_id]**: `object`

## Example Request
```json
{
  "name": "Sample Card",
  "markup": "This is a sample markup content.",
  "color": "blue",
  "icon": "sample-icon",
  "tags": ["tag1", "tag2"],
  "parent_ids": ["parent1", "parent2"],
  "source": "sample-source"
}