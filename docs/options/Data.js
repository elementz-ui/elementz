import React, { useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import faker from 'faker';
import { Switch, Row, Radio, Group } from 'elementz';


const TableDemoData = () => (
  useMemo(() => {
    var data = [];
    var faked = Array.from(Array(1000).keys()).map((i) => ({
      first: faker.name.firstName(),
      last: faker.name.lastName(),
      phone: faker.phone.phoneNumber(),
      country: faker.address.countryCode(),
      age: Math.floor((Math.random() * 50) + 18)
    }));

    for(var i = 0; i < 500; i++) {
      data.push(...faked);
    }
    return data;
  }, [])
);

const TableDemoOptions = function (props) {
  const {
    config,
    setConfig
  } = props;

  
  return (
    <>
      <Group space className='mb-25'>
        { !config.hasOwnProperty('scrollable') ? null :
          <Group.Item flex center end className='col-sm-6 col-md-3 p-0'>
            <span className='mr-10'>Virtualized Scrolling</span>
            <Switch secondary defaultChecked={false} onChange={() => (setConfig({ scrollable: !config.scrollable }))} />
          </Group.Item>
        }
         { !config.hasOwnProperty('infinite') ? null :
          <Group.Item flex center end className='col-sm-6 col-md-3 p-0'>
            <span className='mr-10'>Infinite Scrolling</span>
            <Switch secondary defaultChecked={false} onChange={() => (setConfig({ infinite: !config.infinite }))} />
            </Group.Item>
        }
        {!config.hasOwnProperty('fixed') ? null :
          <Group.Item flex center end className='col-sm-6 col-md-3 p-0'>
            <span className='mr-10'>Fixed Layout</span>
            <Switch secondary defaultChecked={config.fixed} onChange={() => (setConfig({ fixed: !config.fixed }))} />
            </Group.Item>
        }
        {!config.hasOwnProperty('searchable') ? null :
          
          <Group.Item flex center end className='col-sm-6 col-md-3 p-0'>
            <span className='mr-10'>Searchable</span>
            <Switch secondary defaultChecked={config.searchable} onChange={() => (setConfig({ searchable: !config.searchable }))} />
            </Group.Item>
        }
        {!config.hasOwnProperty('filterable') ? null :
          
          <Group.Item flex center end className='col-sm-6 col-md-3 p-0'>
            <span className='mr-10'>Filterable</span>
            <Switch secondary defaultChecked={config.filterable} onChange={() => (setConfig({ filterable: !config.filterable }))} />
            </Group.Item>
        }
        {!config.hasOwnProperty('sortable') ? null :
          
          <Group.Item flex center end className='col-sm-6 col-md-3 p-0'>
            <span className='mr-10'>Sortable</span>
            <Switch secondary defaultChecked={config.sortable} onChange={() => (setConfig({ sortable: !config.sortable }))} />
            </Group.Item>
        }
        {!config.hasOwnProperty('selectable') ? null :
          <Group.Item flex center end className='col-sm-6 col-md-3 p-0'>
            <span className='mr-10'>Selectable</span>
            <Switch secondary defaultChecked={config.selectable} onChange={() => (setConfig({ selectable: !config.selectable }))} />
            </Group.Item>
        }
       {!config.hasOwnProperty('expandable') ? null :
          <Group.Item flex center end className='col-sm-6 col-md-3 p-0'>
            <span className='mr-10'>Expandable</span>
            <Switch secondary defaultChecked={config.expandable} onChange={() => (setConfig({ expandable: !config.expandable }))} />
            </Group.Item>
        }
        {!config.hasOwnProperty('empty') ? null :
          <Group.Item flex center end className='col-sm-6 col-md-3 p-0'>
            <span className='mr-10'>Empty</span>
            <Switch secondary defaultChecked={false} onChange={() => (setConfig({ empty: !config.empty }))} />
            </Group.Item>
        }
        {!config.hasOwnProperty('loading') ? null :
          <Group.Item flex center end className='col-sm-6 col-md-3 p-0'>
            <span className='mr-10'>Loading</span>
            <Switch secondary defaultChecked={false} onChange={() => (setConfig({ loading: !config.loading }))} />
            </Group.Item>
        }
        </Group>
      <hr className='mb-50' style={{
        marginRight: '-16px',
        marginLeft: '-16px'
      }}/>
    </>
  );
}

const data = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

const VerticalBar = () => (<Bar data={data} options={options} />);


const LoremIpsum = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a 		galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It 	was 	popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including 	versions of 	Lorem Ipsum.";

export {TableDemoData, TableDemoOptions, VerticalBar, LoremIpsum};