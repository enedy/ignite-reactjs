module.exports = {
    presets: [
        '@babel/preset-env', // Entender qual o ambiente e dizer para o babel o q ele precisa conversar para o nosso código
        '@babel/preset-typescript', // Adiciono para que o babel entenda typescript
        ['@babel/preset-react', { 
            runtime: 'automatic' // remove a dependencia de importar o "import React from 'react'" nas paginas
        }] // Conseguir entender html dentro do js (particularidade react) 
    ]
}