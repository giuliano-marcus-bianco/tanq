``` mermaid
---
title: Diagrama De Classe
---

classDiagram

    direction LR

    class Entidade {
        <<Abstract>>
        -nome : String
        -senha : String
        -email : String
        -id : int
        -cuponsUsados : ArrayList<>
    }
    
    
    Entidade --o App
    class App {
        - RecuperarSenhaPorEmail(Entidade.email)
        - HashMap Postos
    }

    Entidade <|-- MotoristaComum
    class MotoristaComum{
        + CriarPostagem(idPosto)
    }
    
    class tipoDoCupom{
        <<enumeration>>
        PORCENTAGEM
        VALORADO
    }

    GuardarCupons <|-- Posto
    class GuardarCupons{
        + HashMap()
    }
    
    tipoDoCupom *-- Cupom
    class Cupom{
        - idCupom : String
        - tipo : tipoDoCupom
        - valorMinimoParaPassar : int
        - dataInicio : LocalDateTime
        - dataFim : LocalDateTime
    }
    
    Cupom <.. ControladorDeCupons
    Entidade <|-- Posto
    ControladorDeCupons <|-- Posto
    class Posto{
    
    }

    Entidade <|-- Administrador
    ModeradorDeConteudo <|-- Administrador
    ControladorDeUsuarios <|-- Administrador
    ControladorDeCupons <|-- Administrador
    class Administrador{
        
    }

    class ControladorDeUsuarios {
        <<interface>>
        
        - AdicionarUsuario(Usuario)
        - RemoverUsuario(Usuario)
    }
    
    class ControladorDeCupons {
        <<interface>>
        
        + CriarCuponsDeDescontoPorcentagem(Cupom)
        + CriarCuponsDeDescontoValor(Cupom)
        + EditarCuponsDeDescontoValor(Cupom)
        + EditarCuponsDeDescontoPorcentagem(Cupom)
    }
    
    class ModeradorDeConteudo {
        <<interface>>
        
        - ExcluirConteudo(idConteudo)
    }




```