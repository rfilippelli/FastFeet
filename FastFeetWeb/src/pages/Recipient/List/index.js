import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '~/services/api';

import { HeaderList } from '~/components/ActionHeader';
import Pagination from '~/components/Pagination';
import Action from './Action';

import { Container } from './styles';
import { TableContainer, TableLoading } from '~/components/Table';

export default function RecipentList() {
  const [recipients, setRecipients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecipients, setTotalRecipients] = useState(null);
  const [pages, setPages] = useState(null);
  const [page, setPage] = useState(null);
  const [recipientDetail, setRecipientDetail] = useState(null);
  const [visible, setVisible] = useState(null);

  useEffect(() => {
    async function loadRecipients() {
      try {
        const response = await api.get('/recipients', {
          params: {
            page: currentPage,
            name: search,
          },
        });

        setRecipients(response.data.items);

        setLoading(false);
        setPages(response.data.pages);
        setPage(response.data.page);
        setTotalRecipients(response.data.total);
      } catch (err) {
        toast.error('Não foi possível carregar os Destinatários');
      }
    }

    loadRecipients();
  }, [currentPage, search, setRecipients]);

  function handlePage(page) {
    if (page === 0) {
      setCurrentPage(1);
    } else if (page > pages) {
      setCurrentPage(pages);
    } else {
      setCurrentPage(page);
    }
  }
  function handleVisible() {
    setVisible(!visible);
  }

  function handleDetails(recipient) {
    setRecipientDetail(recipient);
    handleVisible();
  }

  return (
    <Container>
      <HeaderList
        lowercaseTitle="destinatários"
        page="recipient/new"
        visible
        search={search}
        setSearch={setSearch}
      />
      {loading ? (
        <TableLoading />
      ) : (
        <>
          <TableContainer>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Rua</th>
                <th>Nº</th>
                <th>Compl.</th>
                <th>UF</th>
                <th>Cidade</th>
                <th>CEP</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {recipients.map(recipient => (
                <tr key={recipient.id}>
                  <td>#{recipient.id}</td>
                  <td>{recipient.name}</td>
                  <td>{recipient.street}</td>
                  <td>{recipient.number}</td>
                  <td>{recipient.complement}</td>
                  <td>{recipient.state}</td>
                  <td>{recipient.city}</td>
                  <td>{recipient.zip_code}</td>
                  <td>
                    <Action
                      page={`recipient/edit/${recipient.id}`}
                      id={recipient.id}
                      recipients={recipients}
                      setRecipients={setRecipients}
                    />

                    {/* <Action
                      page={`recipient/edit/${recipient.id}`}
                      updateRecipients={() => setRecipients}
                      handleDetails={() => handleDetails(recipient)}
                      id={recipient.id}
                      delivery={recipientDetail}
                    /> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </TableContainer>

          <Pagination
            currentPage={page}
            pages={pages}
            totalDocs={totalRecipients}
            handlePage={handlePage}
          />
        </>
      )}
    </Container>
  );
}
