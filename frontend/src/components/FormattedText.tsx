/**
 * FormattedText 组件
 * 处理 Markdown 格式的文本，支持：
 * - **text** -> 蓝色加粗
 * - _text_ -> 斜体
 * - \n -> 换行
 */

interface FormattedTextProps {
  text: string;
}

export function FormattedText({ text }: FormattedTextProps) {
  // 处理 **text** 和 _text_ 格式，转换为带样式的 span
  const formatText = (content: string) => {
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    
    // 组合正则：匹配 **text** 或 _text_
    const formatRegex = /(\*\*([^*]+)\*\*)|(_([^_]+)_)/g;
    let match;
    
    while ((match = formatRegex.exec(content)) !== null) {
      // 添加匹配前的普通文本
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }
      
      // 判断是粗体还是斜体
      if (match[1]) {
        // **text** - 粗体（蓝色）
        parts.push(
          <span 
            key={`bold-${match.index}`}
            style={{ 
              color: '#00C1E8', 
              fontWeight: 'bold' 
            }}
          >
            {match[2]}
          </span>
        );
      } else if (match[3]) {
        // _text_ - 斜体
        parts.push(
          <span 
            key={`italic-${match.index}`}
            style={{ 
              fontStyle: 'italic',
              opacity: 0.9
            }}
          >
            {match[4]}
          </span>
        );
      }
      
      lastIndex = match.index + match[0].length;
    }
    
    // 添加剩余的文本
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }
    
    return parts;
  };

  // 按换行符分割文本
  const lines = text.split('\n');
  
  return (
    <>
      {lines.map((line, index) => (
        <span key={index}>
          {formatText(line)}
          {index < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

