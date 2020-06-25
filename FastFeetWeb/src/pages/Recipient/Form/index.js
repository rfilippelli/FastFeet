import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

import * as Yup from 'yup';
import api from '~/services/api';

import history from '~/services/history';

import { HeaderForm } from '~/components/ActionHeader';
import { Container, InputContainer1, InputContainer2 } from './styles';

import {
  FormContainer,
  FormLoading,
  Input,
  InputMask,
} from '~/components/Form';

export default function RecipientForm({ match }) {
  const { id } = match.params;

  const [loading, setLoading] = useState(false);
  const [recipient, setRecipient] = useState([]);
  const [buttonLoading, setButtonLoading] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    if (id) {
      // eslint-disable-next-line no-inner-declarations
      async function loadRecipientsDetails() {
        try {
          setLoading(true);
          // const response = await api.get(`/deliveries/${id}`);

          const response = await api.get(`recipients/${id}`);
          setRecipient(response.data);

          setLoading(false);
        } catch (info) {
          toast.info('Insira novos dados para autializar o Destinatários');
        }
      }

      loadRecipientsDetails();
    }
  }, [id]);

  async function handleSubmit(data) {
    try {
      setButtonLoading(true);

      formRef.current.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('O nome do destinatário é obrigatório'),
        street: Yup.string().required('A rua do destinatário é obrigatório'),
        number: Yup.number('Certifique-se que um número foi digitado').required(
          'O número do destinatário é obrigatório'
        ),
        complement: Yup.string(),
        city: Yup.string().required('A cidade do destinatário é obrigatória'),
        state: Yup.string().required('O estado do destinatário é obrigatório'),
        zip_code: Yup.string().required('O CEP do destinatário é obrigatório'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      if (id) {
        await api.put(`/recipients/${id}`, data);
      }

      if (!id) {
        await api.post('/recipients', data);
      }

      setButtonLoading(false);

      toast.success('Destinatário salvo com sucesso');
      history.push('/recipients');
    } catch (err) {
      const validationErrors = {};

      if (err instanceof Yup.ValidationError) {
        err.inner.forEach(error => {
          validationErrors[error.path] = error.message;
        });

        formRef.current.setErrors(validationErrors);
        setButtonLoading(false);
      } else {
        setButtonLoading(false);
        toast.error('Erro ao salvar o destinatário');
      }

      toast.error('Algo deu errado ao salvar o destinatário');
    }
  }

  return (
    <>
      <Container>
        {loading ? (
          <FormLoading />
        ) : (
          <FormContainer
            initialData={recipient}
            onSubmit={handleSubmit}
            ref={formRef}
          >
            <HeaderForm
              id={id}
              prevPage="/recipients"
              title="destinatário"
              loading={buttonLoading}
            />

            <section>
              <Input
                name="name"
                label="Nome"
                placeholder="Nome do destinatário"
              />
              <InputContainer1>
                <Input name="street" label="Rua" placeholder="Rua ..." />
                <Input name="number" label="Número" placeholder=" " />
                <Input name="complement" label="Complemento" />
              </InputContainer1>
              <InputContainer2>
                <Input
                  name="city"
                  label="Cidade"
                  placeholder="Rio de janeiro"
                />
                <Input name="state" label="Estado" placeholder="RJ" />
                <InputMask
                  name="zip_code"
                  label="CEP"
                  mask="99999-999"
                  maskChar=""
                  placeholder="99 9966-5500"
                />
              </InputContainer2>
            </section>
          </FormContainer>
        )}
      </Container>
    </>
  );
}
RecipientForm.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.node,
    }).isRequired,
  }).isRequired,
};
