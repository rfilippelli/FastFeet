import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Route';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

import { DeliveryList, DeliveryForm } from '../pages/Delivery';
import { RecipientList, RecipientForm } from '../pages/Recipient';
import { DeliverymanList, DeliverymanForm } from '../pages/Deliveryman';
import ProblemList from '../pages/Problem/List';

import Profile from '../pages/Profile';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />
      <Route path="/register" component={SignUp} />

      <Route path="/encomendas" component={DeliveryList} isPrivate />
      <Route path="/delivery/new" component={DeliveryForm} isPrivate />
      <Route path="/delivery/edit/:id" component={DeliveryForm} isPrivate />

      <Route path="/recipients" component={RecipientList} isPrivate />
      <Route path="/recipient/new" component={RecipientForm} isPrivate />
      <Route path="/recipient/edit/:id" component={RecipientForm} isPrivate />

      <Route path="/deliverymans" component={DeliverymanList} isPrivate />
      <Route path="/deliveryman/new" component={DeliverymanForm} isPrivate />
      <Route
        path="/deliveryman/edit/:id"
        component={DeliverymanForm}
        isPrivate
      />

      <Route path="/problems" component={ProblemList} isPrivate />

      <Route path="/profile" component={Profile} isPrivate />

      <Route path="/" component={() => <h1>404</h1>} />
    </Switch>
  );
}
