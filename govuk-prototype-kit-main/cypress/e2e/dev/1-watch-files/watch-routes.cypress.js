
// core dependencies
const path = require('path')

// local dependencies
const { waitForApplication } = require('../../utils')

const appRoutesPath = path.join('app', 'routes.js')

const routesFixture = path.join(Cypress.config('fixturesFolder'), 'routes.js')
const appRoutes = path.join(Cypress.env('projectFolder'), appRoutesPath)
const pagePath = '/cypress-test'

describe('watch route file', () => {
  before(() => {
    // Restore routes file from prototype starter
    cy.task('copyFromStarterFiles', { filename: appRoutesPath })
  })

  it(`add and remove ${pagePath} route`, () => {
    waitForApplication()

    cy.task('log', 'The cypress test page should not be found')
    cy.visit(pagePath, { failOnStatusCode: false })
    cy.get('body')
      .should('contains.text', `Page not found: ${pagePath}`)

    cy.task('log', `Replace ${appRoutes} with Cypress routes`)
    cy.task('copyFile', { source: routesFixture, target: appRoutes })

    waitForApplication()

    cy.task('log', 'The cypress test page should be displayed')
    cy.visit(pagePath)
    cy.get('h1')
      .should('contains.text', 'CYPRESS TEST PAGE')

    cy.task('log', `Restore ${appRoutesPath}`)
    cy.task('copyFromStarterFiles', { filename: appRoutesPath })

    waitForApplication()

    cy.task('log', 'The cypress test page should not be found')
    cy.visit(pagePath, { failOnStatusCode: false })
    cy.get('body')
      .should('contains.text', `Page not found: ${pagePath}`)
  })
})
