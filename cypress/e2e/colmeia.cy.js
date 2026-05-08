describe('Testes Exploratórios - Plataforma Colmeia', () => {

  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });

  const acessarDashboard = () => {
    cy.get('input').eq(0).type('qa@test.com');
    cy.get('input').eq(1).type('123456');
    cy.get('button').contains('Entrar').click();
    cy.get('button').contains('Continuar').click();
    
    cy.url({ timeout: 10000 }).should('include', '/dashboard');
    cy.contains('Candidato', { timeout: 10000 }).should('be.visible');
  };

  beforeEach(() => {
    cy.visit('https://teste-colmeia-qa.colmeia-corp.com/');
  });

  it('CT01 - [Bug Crítico] Login permite acesso mesmo acusando credenciais incorretas', () => {
    cy.get('input').eq(0).type('qa@test.com');
    cy.get('input').eq(1).type('123456');
    cy.get('button').contains('Entrar').click();

    cy.contains('Seu login está incorreto, quer continuar?').should('be.visible');
    cy.get('button').contains('Continuar').click();
    cy.url({ timeout: 10000 }).should('include', '/dashboard');
  });

  it('CT02 - [Bug de Usabilidade] Menu Colmeia Forms carrega tela vazia (Dead End)', () => {
    acessarDashboard();

    // Utiliza o seletor exato encontrado no Cypress para expandir o menu
    cy.get('.p-2 > .flex').click();
    
    cy.contains('Colmeia Forms', { matchCase: false, timeout: 10000 }).click();

    cy.url().should('include', 'colmeia-forms');
    cy.get('body').should('not.contain', 'Criar');
  });

  it('CT03 - [Bug de Usabilidade] Botão de Perfil (Candidato) não é interativo', () => {
    acessarDashboard();

    cy.contains('Candidato', { matchCase: false }).click();
    cy.contains('Sair', { matchCase: false }).should('not.exist');
    cy.contains('Logout', { matchCase: false }).should('not.exist');
  });

  it('CT04 - Validação de elementos na tela Bancos de Dados', () => {
    acessarDashboard();

    // Utiliza o seletor exato para expandir o menu
    cy.get('.p-2 > .flex').click();
    
    cy.contains('Bancos de dados', { matchCase: false, timeout: 10000 }).click();

    cy.contains('Nenhum banco de dados encontrado', { matchCase: false, timeout: 10000 }).should('be.visible');
    cy.get('button').contains('Criar', { matchCase: false }).should('be.visible');
    cy.get('input').should('be.visible'); 
  });
});