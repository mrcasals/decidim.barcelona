class MeetingsDirectory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meetings: this.props.meetings,
      filter: this.props.filter,
      tagCloud: this.props.tagCloud,
      loading: false
    };
  }

  render () {
    return (
      <div className="meetings-directory">
        <div className="small-12 medium-3 column">
          <aside className="sidebar" role="complementary">
            <MeetingsFilter 
              filterUrl={this.props.filterUrl}
              filter={this.state.filter}
              districts={this.props.districts} 
              meetings={this.state.meetings} 
              categories={this.props.categories}
              subcategories={this.props.subcategories} 
              tagCloud={this.state.tagCloud}
              tagsEnabled={this.props.tagsEnabled}
              onLoading={() => this.setState({ loading: true })}
              onFilterResult={({ meetings, filter, tag_cloud }) => this.setState({ meetings, filter, tagCloud: tag_cloud, loading: false })} />
          </aside>
        </div>

        <div id="proposals" className="small-12 medium-9 column">
          <Loading show={this.state.loading} />
          <div className="row">
            <MeetingsMap meetings={this.state.meetings} />
          </div>
          <div className="row">
            <MeetingsList meetings={this.state.meetings} />
          </div>
        </div>

      </div>
    );
  }
}
