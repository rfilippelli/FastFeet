import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';

import Notifications from '~/components/Notifications';
import logo from '~/assets/logo.svg';
import { signOut } from '~/store/modules/auth/actions';

import { Container, Content, Profile, Navigation } from './styles';

export default function Header() {
  const dispatch = useDispatch();
  const profile = useSelector(state => state.user.profile);

  function handleSingOut() {
    dispatch(signOut());
  }

  return (
    <Container>
      <Content>
        <img src={logo} alt="FastFeet" />
        <Navigation>
          <NavLink to="/dashboard" activeClassName="selected">
            ENCOMENDAS
          </NavLink>

          <NavLink to="/recipients" activeClassName="selected">
            DESTINATÁRIOS
          </NavLink>

          <NavLink to="/deliverymans" activeClassName="selected">
            ENTREGADORES
          </NavLink>

          <NavLink to="/problems" activeClassName="selected">
            PROBLEMAS
          </NavLink>
        </Navigation>

        <aside>
          <Notifications />
          <Profile>
            <div>
              <strong>{profile.name}</strong>
              <button type="button" onClick={handleSingOut}>
                sair do sistema
              </button>
              {/* <Link to="/profile">Meu perfil</Link> */}
            </div>

            {/* <img src={profile.avatar.url} alt={profile.name} /> */}
          </Profile>
        </aside>
      </Content>
    </Container>
  );
}
