import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import { Table } from 'antd';
import reqwest from 'reqwest';

const columns = [
  {
    title: 'Task',
    dataIndex: 'task',
    width: '20%',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    filters: [
      { text: 'Pending', value: 'Pending' },
      { text: 'Complete', value: 'Complete' },
    ],
    width: '20%'
  },
  {
    title: 'Due Date',
    dataIndex: 'due_date',
    render: due_date => `${new Date(due_date * 1000)}`,
    sorter: true
  },
];

const getRandomuserParams = params => {
  return {
    results: params.pagination.pageSize,
    page: params.pagination.current,
    ...params,
  };
};

class App extends React.Component {
  state = {
    data: [],
    pagination: {
      current: 1,
      pageSize: 10,
    },
    loading: false,
  };

  componentDidMount() {
    const { pagination } = this.state;
    this.fetch({ pagination });
  }

  handleTableChange = (pagination, filters, sorter) => {
    console.log(sorter);
    this.fetch({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination,
      ...filters,
    });
  };

  fetch = (params = {}) => {
    this.setState({ loading: true });
    reqwest({
      url: '/task',
      method: 'get',
      type: 'json',
      // data: getRandomuserParams(params),
      data: {
        user_id: '5f1d0e62f9d77c2f21d22e45',
        filter: JSON.stringify(params.status),
        sort_by: params.sortField,
        sort_order: params.sortOrder
      }
    }).then(data => {
      console.log(data);
      this.setState({
        loading: false,
        data: data,
        pagination: {
          ...params.pagination,
          total: 20,
          // 200 is mock data, you should read it from server
          // total: data.totalCount,
        },
      });
    });
  };

  render() {
    const { data, pagination, loading } = this.state;
    return (
      <Table
        columns={columns}
        rowKey={record => data._id}
        dataSource={data}
        pagination={pagination}
        loading={loading}
        onChange={this.handleTableChange}
      />
    );
  }
}

ReactDOM.render(<App />, document.getElementById('container'));