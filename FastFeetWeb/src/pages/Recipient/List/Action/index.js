import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MdMoreHoriz, MdCreate, MdDeleteForever } from 'react-icons/md';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import { TableAction } from '~/components/Table';
import history from '~/services/history';

import api from '~/services/api';

import { Container } from './styles';

export default function Action({ page, id, recipients, setRecipients }) {
  const [visible, setVisible] = useState(false);

  function handleVisible() {
    setVisible(!visible);
  }

  async function handleDelete() {
    try {
      await api.delete(`/recipients/${id}`);

      toast.success(`Item #${id} deletado com sucesso`);

      // // eslint-disable-next-line react/prop-types
      const recipientFilter = recipients.filter(d => d.id !== id);
      setRecipients(recipientFilter);
    } catch (err) {
      toast.error('Ocorreu um erro ao tentar excluir o item');
    }
  }
  function confirmDelete() {
    confirmAlert({
      title: 'Alerta',
      message: `Tem certeza que deseja deletar o destinatario ${id}?`,
      closeOnEscape: false,
      closeOnClickOutside: false,
      buttons: [
        {
          label: 'Sim',
          onClick: () => handleDelete(),
        },
        {
          label: 'Não',
        },
      ],
    });
  }

  return (
    <Container>
      <button onClick={handleVisible} type="button">
        <MdMoreHoriz size={22} color="#c6c6c6" />
      </button>

      <TableAction visible={visible}>
        <div>
          <Link to={`/${page}`}>
            <MdCreate size={18} color="#4D85EE" />
            Edit
          </Link>
        </div>
        <div>
          <button type="button" onClick={confirmDelete}>
            <MdDeleteForever size={18} color="#DE3B3B" />
            Ecluir
          </button>
        </div>
      </TableAction>
    </Container>
  );
}

Action.propTypes = {
  page: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  recipients: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
    .isRequired,
  setRecipients: PropTypes.func.isRequired,
};
