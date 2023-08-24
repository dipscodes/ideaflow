import { FC, useEffect } from "react";
import { AnnotationExtension } from "remirror/extensions";
import {
  EditorComponent,
  Remirror,
  ThemeProvider,
  useRemirror,
  useRemirrorContext,
} from "@remirror/react";

const SAMPLE_TEXT = "This is a sample text";

const SmallEditor: FC = () => {
  const { setContent, commands } = useRemirrorContext({
    autoUpdate: true,
  });

  useEffect(() => {
    setContent({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: `${SAMPLE_TEXT} `,
            },
          ],
        },
      ],
    });
    commands.setAnnotations([
      {
        id: "a-1",
        from: 1,
        to: SAMPLE_TEXT.length + 1,
      },
    ]);
  }, [setContent, commands]);

  return (
    <div id="editor" className="px-3">
      <EditorComponent />
    </div>
  );
};

const Basic: FC = () => {
  const { manager } = useRemirror({
    extensions: () => [new AnnotationExtension()],
  });

  return (
    <ThemeProvider>
      <Remirror manager={manager}>
        <SmallEditor />
      </Remirror>
    </ThemeProvider>
  );
};

export default Basic;
