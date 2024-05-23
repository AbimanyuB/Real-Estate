import { listData } from "../../lib/dummydata";
import "./listPage.scss";
import Filter from "../../components/filter/Filter"
import Card from "../../components/card/Card"
import Map from "../../components/map/Map";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense } from "react";

function ListPage() {
  const data = useLoaderData();

  return <div className="listPage">
    <div className="listContainer">
      <div className="wrapper">
        <Filter/>
        <Suspense fallback={<o>Loading...</o>}>
          <Await
            resolve={data.postResponse}
            errorElement={
              <p>Error loading data</p>
            }
          >
            {(postResponse) => {
              return postResponse.data.map(item => {
                return <Card key={item.id} item={item}/> })}
            }
          </Await>
        </Suspense>
      </div>
    </div>
    <div className="mapContainer">
    <Suspense fallback={<o>Loading...</o>}>
      <Await
        resolve={data.postResponse}
        errorElement={
          <p>Error loading data</p>
        }
      >
        {(postResponse) => {
          return <Map items={postResponse.data}/>
        }}
      </Await>
    </Suspense>
    </div>
  </div>;
}

export default ListPage;
