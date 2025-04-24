import { mathFromMarkdown, mathToMarkdown } from "mdast-util-math"
import { Construct, Code, Effects, State } from "micromark-util-types"

declare module "micromark-util-types" {
  /**
   * Compile data.
   */
  interface CompileData {
    mathFlowOpen?: boolean
  }

  /**
   * Token types.
   */
  interface TokenTypeMap {
    mathFlow: "mathFlow"
    mathFlowFence: "mathFlowFence"
    mathFlowValue: "mathFlowValue"
    mathText: "mathText"
    mathTextData: "mathTextData"
    mathTextPadding: "mathTextPadding"
    mathTextSequence: "mathTextSequence"
  }
}

export default function remarkMath() {
  // @ts-expect-error: TS is wrong about `this`.
  // eslint-disable-next-line unicorn/no-this-assignment
  const self = /** @type {Processor} */ this
  const data = self.data()

  const micromarkExtensions = data.micromarkExtensions || (data.micromarkExtensions = [])
  const fromMarkdownExtensions = data.fromMarkdownExtensions || (data.fromMarkdownExtensions = [])
  const toMarkdownExtensions = data.toMarkdownExtensions || (data.toMarkdownExtensions = [])

  micromarkExtensions.push(math())
  fromMarkdownExtensions.push(mathFromMarkdown())
  toMarkdownExtensions.push(mathToMarkdown())
}

function lineEnding(code: Code) {
  return code && code < -2
}

function math() {
  return {
    flow: {
      [36]: mathFlow(),
    },
    text: {
      [36]: mathText(),
    },
  }
}

function mathText(): Construct {
  return {
    tokenize,
    name: "mathText",
  }

  function tokenize(effects: Effects, ok: State, nok: State) {
    let size = 0
    return start

    function start(code: Code): State | undefined {
      effects.enter("mathText")
      return sequence(code)
    }

    function sequence(code: Code): State | undefined {
      if (size >= 2) return nok(code)
      if (code === 36) {
        effects.consume(code)
        size++
        return sequence
      }

      if (code === null || lineEnding(code)) return nok(code)

      effects.enter("mathTextData")
      return data(code)
    }

    function data(code: Code) {
      if (code === null || lineEnding(code)) return nok(code)
      if (code === 36) return closeSequence(code)
      effects.consume(code)
      return data
    }

    function closeSequence(code: Code): State | undefined {
      effects.exit("mathTextData")
      effects.consume(code)
      effects.exit("mathText")
      return ok(code)
    }
  }
}

function mathFlow(): Construct {
  const nonLazyContinuation = {
    tokenize: tokenizeNonLazyContinuation,
    partial: true,
  }

  return {
    tokenize,
    concrete: true,
    name: "mathFlow",
  }

  function tokenize(effects: Effects, ok: State, nok: State) {
    let sizeOpen = 0
    return start
    function start(code: Code): State | undefined {
      effects.enter("mathFlow")
      effects.enter("mathFlowFence")
      return sequence(code)
    }

    function sequence(code: Code): State | undefined {
      if (code === 36) {
        effects.consume(code)
        sizeOpen++
        return sequence
      }
      if (sizeOpen < 2) {
        return nok(code)
      }
      effects.exit("mathFlowFence")
      return effects.attempt(nonLazyContinuation, beforeNonLazyContinuation, after)(code)
    }

    function beforeNonLazyContinuation(code: Code) {
      return effects.attempt(
        {
          tokenize: tokenizeClosingFence,
          partial: true,
        },
        after,
        beforeContentChunk,
      )(code)
    }

    function beforeContentChunk(code: Code): State | undefined {
      if (code === null) return after(code)
      if (lineEnding(code) || code === 36)
        return effects.attempt(nonLazyContinuation, beforeNonLazyContinuation, after)(code)
      effects.enter("mathFlowValue")
      return contentChunk(code)
    }

    function contentChunk(code: Code) {
      if (code === null || lineEnding(code)) {
        effects.exit("mathFlowValue")
        return beforeContentChunk(code)
      }
      if (code === 36) {
        effects.exit("mathFlowValue")
        return beforeNonLazyContinuation(code) 
      }
      effects.consume(code)
      return contentChunk
    }

    function after(code: Code) {
      effects.exit("mathFlow")
      return ok(code)
    }

    function tokenizeClosingFence(effects: Effects, ok: State, nok: State) {
      let sizeClose = 0
      return beforeSequenceClose

      function beforeSequenceClose(code: Code) {
        effects.enter("mathFlowFence")
        return sequenceClose(code)
      }

      function sequenceClose(code: Code) {
        if (code === 36) {
          sizeClose++
          effects.consume(code)
          return sequenceClose
        }
        if (sizeClose < sizeOpen) return nok(code)
        if (code === null || lineEnding(code)) {
          effects.exit("mathFlowFence")
          return ok(code)
        }
        return nok(code)
      }
    }
  }

  function tokenizeNonLazyContinuation(effects: Effects, ok: State, nok: State) {
    // @ts-expect-error: TS is wrong about `this`.
    // eslint-disable-next-line unicorn/no-this-assignment
    const self = this
    return start

    function start(code: Code) {
      if (code === null) {
        return ok(code)
      }
      effects.enter("lineEnding")
      effects.consume(code)
      effects.exit("lineEnding")
      return lineStart
    }

    function lineStart(code: Code) {
      return self.parser.lazy[self.now().line] ? nok(code) : ok(code)
    }
  }
}
