import { useEffect, useState } from 'react';
import './App.css';
import { API, Amplify, graphqlOperation } from 'aws-amplify';
import awsExports from './aws-exports';

/* lucasaws2023 test */
// const APPSYNC_GRAPHQL_ENDPOINT = 'https://2romav4uv5dgjaq7miv2tssebe.appsync-api.us-east-1.amazonaws.com/graphql';
// const APPSYNC_REGION = 'us-east-1';
// const APPSYNC_GRAPHQL_SUBSCRIPTIONS_ENDPOINT = 'wss://2romav4uv5dgjaq7miv2tssebe.appsync-realtime-api.us-east-1.amazonaws.com/graphql';
// const API_KEY = 'da2-dyu2qbotnnhmlbuynzzyy7brri';

/* lucasaws2024 test */
const APPSYNC_GRAPHQL_ENDPOINT = 'https://ltcojn3bvjacfdasohegym5bje.appsync-api.us-east-1.amazonaws.com/graphql';
const APPSYNC_REGION = 'us-east-1';
const APPSYNC_GRAPHQL_SUBSCRIPTIONS_ENDPOINT = 'wss://ltcojn3bvjacfdasohegym5bje.appsync-realtime-api.us-east-1.amazonaws.com/graphql';
const API_KEY = 'da2-cl4p6onojvghpp4pytavyquvxy';
const COGNITO_IDENTITY_POOL_ID = 'us-east-2:8fee5467-dc6f-4416-9b74-a9c3724fd836';
const COGNITO_REGION = 'us-east-2';

/* ac - bat */
// const APPSYNC_GRAPHQL_ENDPOINT = 'https://cart.appsync-api-ecom-bat.digital.aircanada.com/graphql';
// const APPSYNC_REGION = 'us-east-2';
// const APPSYNC_GRAPHQL_SUBSCRIPTIONS_ENDPOINT = 'wss://cart.appsync-api-ecom-bat.digital.aircanada.com/graphql/realtime';
// const API_KEY = 'da2-zom2ukoxdnh53c5jdxkfju56ju';

const myApiConfig = {
  aws_appsync_graphqlEndpoint: APPSYNC_GRAPHQL_ENDPOINT,
  aws_appsync_realtimeGraphqlEndpoint: APPSYNC_GRAPHQL_SUBSCRIPTIONS_ENDPOINT,
  aws_appsync_region: APPSYNC_REGION,
  aws_appsync_authenticationType: 'API_KEY',
  aws_appsync_apiKey: API_KEY,
};

const cognitoConfig = {
  aws_cognito_region: COGNITO_REGION,
  aws_cognito_identity_pool_id: COGNITO_IDENTITY_POOL_ID,
};

Amplify.configure({
  ...awsExports,
  ...myApiConfig,
  ...cognitoConfig,
});

function App () {
  const [subscriptionId, setSubscriptionId] = useState('');
  const [newStatus, setNewStatus] = useState('');

  const [latestSubscriptionData, setLatestSubscriptionData] = useState({});

  const [orderCreationSubscriptionId, setOrderCreationSubscriptionId] = useState('');
  const [isOrderCreated, setIsOrderCreated] = useState(false);

  const [authType, setAuthType] = useState('API_KEY');

  useEffect(() => {
    console.log('authType:', authType);
    const AuthTypes = ['API_KEY', 'AWS_IAM', 'AMAZON_COGNITO_USER_POOLS', 'OPENID_CONNECT', 'AWS_LAMBDA', 'AMAZON_COGNITO_IDENTITY'];
    if (!AuthTypes.includes(authType)) {
      console.log('Invalid authType:', authType);
      return;
    }
    const myApiConfig = {
      aws_appsync_graphqlEndpoint: APPSYNC_GRAPHQL_ENDPOINT,
      aws_appsync_realtimeGraphqlEndpoint: APPSYNC_GRAPHQL_SUBSCRIPTIONS_ENDPOINT,
      aws_appsync_region: APPSYNC_REGION,
      aws_appsync_authenticationType: authType,
      aws_appsync_apiKey: API_KEY,
    };

    const cognitoConfig = {
      aws_cognito_region: COGNITO_REGION,
      aws_cognito_identity_pool_id: COGNITO_IDENTITY_POOL_ID,
    };
    Amplify.configure({
      ...awsExports,
      ...myApiConfig,
      ...cognitoConfig,
    });
  }, [authType]);

  const addPassengersGql = `mutation AddPassengers {
    addPassengers(input: {itineraries: {id: ""}}) {
      name
    }
  }`;

  const testMutationGql = (pnrStatus, subscriptionId) => `mutation MyMutation {
    orderCreation(input: {pnrStatus: "${pnrStatus}", subscriptionId: "${subscriptionId}"}) {
      subscriptionId
      isOrderCreated
    }
  }`;
  const onTestSubscriptionGql = (pnrStatus, subscriptionId) => `subscription OnOrderCreated {
    orderCreation(input: {pnrStatus: "${pnrStatus}", subscriptionId: "${subscriptionId}"}) {
      subscriptionId
      isOrderCreated
    }
  }`;


  const onOrderCreationMutationGql = (orderSubscriptionId, isOrderCreated) => `mutation MyMutation {
    orderCreation(orderCreationInput: {orderSubscriptionId: "${orderSubscriptionId}", responseData: {isOrderCreated: ${isOrderCreated}}}) {
      responseData {
        isOrderCreated
      }
      sessionData {
        transactionId
        bookingSessionId
      }
      orderSubscriptionId
    }
  }`;
  const onOrderCreationSubscriptionGql = (subscriptionId) => `subscription OnOrderCreation {
    onOrderCreation(orderSubscriptionId: "${subscriptionId}") {
      orderSubscriptionId
      errors {
        systemSubService
        systemService
        systemErrorMessage
        systemErrorCode
        friendlyCode
      }
      warnings {
        systemSubService
        systemService
        systemErrorMessage
        systemErrorCode
        friendlyCode
      }
      sessionData {
        transactionId
        bookingSessionId
      }
      responseData {
        isOrderCreated
      }
    }
  }`;



  const getPassengers = async () => {
    try {
      const data = await API.graphql(graphqlOperation(addPassengersGql));
      console.log('received passengers response:', data);
    } catch (ex) {
      console.log('Error in passengers: ', ex);
    }
  };

  const onSubscribeClicked = async () => {
    try {
      API.graphql(graphqlOperation(
        onTestSubscriptionGql(subscriptionId),
        { filter: { subscriptionId: { eq: subscriptionId } } }
      )).subscribe({
        next: ({ provider, value }) => {
          console.log('received subscription data:', provider, value);
        },
        error: error => console.log('error in subscription communication', error),
      });
    } catch (ex) {
      console.log('Error in onSubscribeClicked: ', ex);
    }
  };
  const onSendNewStatusClicked = async () => {
    try {
      const data = await API.graphql(graphqlOperation(testMutationGql(newStatus, subscriptionId)));
      console.log('received order creation response:', data);
    } catch (ex) {
      console.log('Error in onSendNewStatusClicked: ', ex);
    }
  };

  const onSubscribeToOrderCreationClicked = async () => {
    try {
      API.graphql(graphqlOperation(
        onOrderCreationSubscriptionGql(orderCreationSubscriptionId),
        { filter: { orderSubscriptionId: { eq: orderCreationSubscriptionId } } }
      )).subscribe({
        next: ({ provider, value }) => {
          console.log('received subscription data:', provider, value);
          setLatestSubscriptionData(value.data.onOrderCreation);
        },
        error: error => console.log('error in subscription communication', error),
      });
    } catch (ex) {
      console.log('Error in onSubscribeToOrderCreationClicked: ', ex);
    }
  };
  const onSendOrderCreationClicked = async () => {
    try {
      const data = await API.graphql(graphqlOperation(onOrderCreationMutationGql(orderCreationSubscriptionId, isOrderCreated)));
      console.log('received order creation response:', data);
      setLatestSubscriptionData(data.data.onOrderCreation);
    } catch (ex) {
      console.log('Error in onSendOrderCreationClicked: ', ex);
    }
  };





  // test auth via idp (guest)
  const getLucasTest3Gql = () => `query MyQuery {
    getLucasTest3(input: {bookingSessionId: "", id: "", testJson: ""}) {
      id
      originalJson
      test1
      test2
    }
  }`;
  const onSendGuestGqlClicked = async () => {
    try {
      const data = await API.graphql(graphqlOperation(getLucasTest3Gql()));
      console.log('received guest response:', data);
    } catch (ex) {
      console.log('Error in onSendGuestGqlClicked: ', ex);
    }
  };



  return (
    <>
      <div>

        {/* TESTING ON APPSYNC TEST ACCOUNT (lucasaws2023) */}
        {/* <h2>Test App for appsync-gql-aws</h2>
        <hr />
        <hr />

        <div>
          <h3>Get passengers test</h3>
          <button onClick={() => getPassengers()}>GetPassengers</button>
        </div>

        <hr />
        <hr />

        <div>
          <h3>Subscription</h3>
          <p><span>SubscriptionId: </span><input type='text' value={subscriptionId} onChange={(e) => setSubscriptionId(e.target.value)} /></p>
          <button onClick={() => onSubscribeClicked()}>Subscribe</button>
        </div>

        <div>
          <p>Send new status to mutation: <input type='text' value={newStatus} onChange={(e) => setNewStatus(e.target.value)} /></p>
          <button onClick={() => onSendNewStatusClicked()}>Send new status</button>
          <p><span>Latest subscription data received: </span><span>{JSON.stringify(latestSubscriptionData)}</span></p>
        </div> */}



        <h3>order creation mutation and subscription test</h3>

        <div>
          <label>subscription id: </label>
          <input
            value={orderCreationSubscriptionId}
            onChange={(e) => setOrderCreationSubscriptionId(e.target.value)}
          />
        </div>

        <hr />
        <hr />

        <div>
          <button onClick={() => onSubscribeToOrderCreationClicked()}>Subscribe</button>
        </div>

        <hr />
        <hr />

        <div>
          <button onClick={() => setIsOrderCreated(!isOrderCreated)}>is order created: {isOrderCreated ? 'true' : 'false'}</button>
          <button onClick={() => onSendOrderCreationClicked()}>Send order creation</button>
        </div>


      </div>

      <hr />
      <hr />
      <hr />
      <hr />

      <div>
        <h2>Test guest access</h2>
        <hr />
        <hr />

        <div>
          <label>authType: </label>
          <small>API_KEY, AWS_IAM, AMAZON_COGNITO_USER_POOLS, OPENID_CONNECT, AWS_LAMBDA, AMAZON_COGNITO_IDENTITY</small>
          <input type='text' value={authType} onChange={(e) => setAuthType(e.target.value)} />
          <button onClick={() => onSendGuestGqlClicked()}>Send guest gql</button>
        </div>

      </div>
    </>
  );
}

export default App;
