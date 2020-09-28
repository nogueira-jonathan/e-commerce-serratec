import React, { useEffect, useState } from 'react';
import { Conteudo, Table } from './style';
import { FiTrash2 } from 'react-icons/fi'
import { FcCancel } from "react-icons/fc";
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import api from '../../services/api';
import { useHistory } from 'react-router-dom';


const Carrinho = () => {

    const [produto, setProduto] = useState([]);
    const [valorTotal, setValorTotal] = useState([]);
    const [login, setLogin] = useState();
    var total = [];
    const history = useHistory();


    const buscarProdutos = () => {
        var produtos = JSON.parse(localStorage.getItem('@LOJA:produto'));
        setProduto(produtos)
    }

    useEffect(() => {
        buscarProdutos();
    }, []);

    function limpar() {
        localStorage.removeItem('@LOJA:produto');
        setProduto('')
    }

    const calcularValorTotal = () => {
        produto.map((e) => {
            total.push(e.valor)
        })
        setValorTotal(total.reduce((total, currentElement) => total + currentElement))
    }

   

    const comprar = async () =>{

        if(!localStorage.getItem('@LOJA:user')){
            setLogin('Você deve realizar o login');
            return;
        }else{

        var produtos = JSON.parse(localStorage.getItem('@LOJA:produto'));

        produtos.map((prod,t) => {

            const params = {
                nome: prod.nome,
                descricao: prod.descricao,
                qtdEstoque: prod.qtdEstoque -1,
                valor: prod.valor,
                idCategoria: prod.idCategoria,
                idFuncionario: prod.idFuncionario,
                dataFabricao: prod.dataFabricacao,
                fotoLink: prod.fotoLink
            }
                alterarEstoque(params,prod.id)
                produtos.splice(t, 1)
            
        })  
        

        
       
       setTimeout(() => {
            limpar();
            history.push("/sucesso")
       }, 3000);
        }
    }
    

    async function alterarEstoque (params, produtoID){
        try {
           await api.put(`produto/${produtoID}`, params);
                    
         } catch (error) {
             console.log('Erro na compra', error);
         }
    }

    function removerProduto(a){
        var produtos = JSON.parse(localStorage.getItem('@LOJA:produto'));

        produtos.splice(a,1)
         
        localStorage.setItem('@LOJA:produto',JSON.stringify(produtos));
        buscarProdutos();
    }


    return (
        <Conteudo>
            {produto ? (
                <div>
                    {produto.map((p, a) => {
                        return (
                            <Table key={p.id}>
                                <tr>
                                    <th>Produto</th>
                                    <th>Nome</th>
                                    <th>Descrição</th>
                                    <th>Valor</th>
                                    <th>Excluir</th>
                                </tr>
                                <tr>
                                  
                                    <td><img src={p.fotoLink} style={{ maxWidth: "65px" }} ></img></td>
                                    <td > {p.nome} </td>
                                    <td > {p.descricao}</td>
                                    <td> {p.valor}</td>
                                    <td style={{ textAlign: "center" }}><FcCancel size={20} onClick={e => removerProduto(a)} /></td>
                                </tr>
                            </Table>
                        )
                    })}
                    <div>
                        <button onClick={e => calcularValorTotal()}>Calcular Total </button>
                        <p> Valor Total {valorTotal} </p>

                    </div>
                </div>
            ) : (
                    <div>
                        <p> Nenhum produto no carrinho</p>
                    </div>
                )}

            <Button variant="contained" color="secondary" onClick={e => limpar()} >
                Limpar
        </Button>
       
            <Button variant="contained" color="primary" onClick={e => comprar()}  >
                Comprar
        </Button>
        {login}
        </Conteudo>
    )
}

export default Carrinho;