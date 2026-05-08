describe('Suite de Testes E2E - Plataforma Colmeia', () => {

  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });

  const realizarLogin = () => {
    cy.get('input').eq(0).type('qa@test.com');
    cy.get('input').eq(1).type('123456');
    cy.get('button').contains('Entrar').click();
    cy.get('button').contains('Continuar').click();
    cy.url({ timeout: 10000 }).should('include', '/dashboard');
  };

  beforeEach(() => {
    cy.visit('https://teste-colmeia-qa.colmeia-corp.com/');
  });

  it('CT01 - [Segurança] Bypass no Modal de Erro de Login', () => {
    cy.get('input').eq(0).type('qa@test.com');
    cy.get('input').eq(1).type('123456');
    cy.get('button').contains('Entrar').click();
    cy.contains('Seu login está incorreto, quer continuar?').should('be.visible');
    cy.get('button').contains('Continuar').click();
    cy.url().should('include', '/dashboard');
  });

  it('CT02 - [Usabilidade] Mapeamento de Tela Vazia em Colmeia Forms', () => {
    realizarLogin();
    cy.get('.p-2 > .flex').click();
    cy.contains('Colmeia Forms').click();
    cy.url().should('include', 'colmeia-forms');
    cy.get('body').should('not.contain', 'Criar'); 
  });

  it('CT03 - [Interface] Componente de Usuário sem Interatividade', () => {
    realizarLogin();
    cy.contains('Candidato').click();
    cy.contains('Sair').should('not.exist');
  });

  it('CT04 - [Funcionalidade] Verificação de Componentes em Bancos de Dados', () => {
    realizarLogin();
    cy.get('.p-2 > .flex').click();
    cy.contains('Bancos de dados').click();
    
    // Valida o estado inicial (tela vazia)
    cy.contains('Nenhum banco de dados encontrado').should('be.visible');
    
    // Testa a interação com o campo de pesquisa
    cy.get('input[placeholder*="Pesquisar"]').should('be.visible').type('QA-Test');
  });

  it('CT05 - [Sessão] Verificação de Persistência após Reload', () => {
    realizarLogin();
    cy.reload();
    cy.url().should('include', '/dashboard');
    cy.contains('Candidato').should('be.visible');
  });
});