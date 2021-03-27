import { useState } from 'react';
import { useFlexSize } from './hooks/useFlexSize';
import { markdownToHTML } from './shared/parser';
import Dock from './components/Dock';
import DockPanel from './components/DockPanel';
import './styles/App.scss';

const MARKED_PLACEHOLDER = `# Markdown Previewer
## A cool markdown previewer made in React!

### I made this live on my [stream](https://twitch.tv/runefarer "Runefarer on Twitch")!
![Runefarer Logo](https://static-cdn.jtvnw.net/jtv_user_pictures/3cbd0cf1-b4eb-4ce0-aa30-691085cfbe3f-profile_image-300x300.png)

#### A few things:
- I am using [marked](https://marked.js.org) and [DOMPurify](https://github.com/cure53/DOMPurify) to handle the markdown.
- I am also using React and SCSS.
- I am trying to use React's \`useState\` and other hooks, and trying to **avoid** class components.

#### I prefer this syntax:
\`\`\`javascript
// This just feels better
const Counter = (props) => {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Count Up
      </button>
      <div>{count}</div>
    </div>
  );
}
\`\`\`

> Just testing the markdown, this should be
> a multiline quote!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | -------------
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbererd lists too.
1. Use just 1s if you want!
1. And last but not least, let's not forget embedded images:`;

const DOCK_BREAKPOINT_WIDTH = 600;

export const App = props => {
  // FIX THIS, IDIOT!!!!!!!!!!!!!
  const [markdown, setMarkdown] = useState(MARKED_PLACEHOLDER);
  const [containerRef, childRefs, flexHeight] = useFlexSize(1);
  
  const handleChange = event => {
    setMarkdown(event.target.value);
  };
  
  return (
    <div className="container" ref={containerRef}>
      <div className="header" ref={childRefs[0]}>
        <h1 className="heading">
          markpen.io
        </h1>
      </div>
      <Dock height={flexHeight} breakpointWidth={DOCK_BREAKPOINT_WIDTH}>
        <DockPanel title="Editor" icon="fas fa-code">
          <textarea id="editor" value={markdown} onChange={handleChange} />
        </DockPanel>
        <DockPanel title="Previewer" icon="fas fa-file-code">
          <div id="preview" dangerouslySetInnerHTML={{
              __html: markdownToHTML(markdown)
            }}/>
        </DockPanel>
      </Dock>
    </div>
  );
};

export default App;
