
// core dependencies
const path = require('path')

// local dependencies
const { waitForApplication } = require('../../utils')

const appViews = path.join(Cypress.env('projectFolder'), 'app', 'views')
const pluginFooView = path.join(appViews, 'plugin-foo.html')

const WHITE = 'rgb(255, 255, 255)'
const YELLOW = 'rgb(255, 255, 0)'
const BLUE = 'rgb(0, 0, 255)'

const pluginFooViewMarkup = `
{% extends "layouts/main.html" %}

{% block content %}
{% include "foo.njk" %}
{% endblock %}

{% block pageScripts %}
<script>
  window.GOVUKPrototypeKit.documentReady(() => {
    new window.FOO.Modules.PluginFoo('.test-foo')
  })
</script>
{% endblock %}
`

describe('Single Plugin Test', async () => {
  before(() => {
    cy.task('createFile', { filename: pluginFooView, data: pluginFooViewMarkup })
  })

  it('Loads plugin-foo view correctly', () => {
    waitForApplication()
    cy.visit('/plugin-foo')
    cy.get('.plugin-foo')
      .should('contains.text', 'Plugin Foo')
  })

  it('Loads plugin-foo style correctly', () => {
    waitForApplication()
    cy.visit('/plugin-foo')
    cy.get('.plugin-foo')
      .should('have.css', 'background-color', YELLOW)
      .should('have.css', 'border-color', WHITE)
  })

  it('Loads plugin-foo script correctly', () => {
    waitForApplication()
    cy.visit('/plugin-foo')
    cy.get('.plugin-foo').click()
    cy.get('.plugin-foo').should('have.css', 'background-color', BLUE)
    cy.get('.plugin-foo').should('have.css', 'border-color', WHITE)
  })
})
