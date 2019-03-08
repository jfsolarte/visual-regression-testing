describe('screenshot Paleta de colores', function() {
    it('Click en btn para generar paleta de colores', function() {
        cy.visit('https://jfsolarte.github.io/taller6_Visual-Regression-Testing-Resemble-JS')
        cy.contains(' Generar nueva paleta').click()
        
        var fileName = '1';
        cy.screenshot(fileName)
        cy.contains(' Generar nueva paleta').click()
        fileName = '2'; 
        cy.screenshot(fileName)
    })
})