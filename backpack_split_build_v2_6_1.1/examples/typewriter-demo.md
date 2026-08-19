# Markdown Typewriter

Normal typing can mix with <!--tempo:3/2-->quicker conversational rhythm<!--tempo:1--> and return to a stable tempo.

## Colour commands

This word is <!--textcolour:red-->red<!--textcolour--> and this one is back to the theme colour.

This background is <!--textbg:#000000--><!--textcolour:white-->black<!--textcolour--><!--textbg-->.

<!--textbg:#FFFFFF--><!--textcolour:(0, 0, 255)-->This text is rendered blue with a white background.<!--textcolour--><!--textbg-->

Nested colours restore the previous scope: <!--textcolour:red-->red, <!--textcolour:#0066ff-->blue,<!--textcolour--> red again.<!--textcolour-->

## Rotative text

Example mammals are <!--SlotRotation:dogs|cats|mice|cows--> while this sentence keeps typing beside the independent slot.

A response can be <!--DeleteRotation:drafted|edited|approved--> while the main text continues.

Status: <!--StrikeRotation:wrong|maybe|correct--> and still typing.

One-shot rotation blocks the stream: <!--Strike:Insects|Birds|Fish--> and then typing resumes.

## Typo hint

A typ\<w><e>able phrase can intentionally correct itself.

Commands remain literal in code:

```md
<!--textcolour:red-->not interpreted here<!--textcolour-->
<!--SlotRotation:one|two|three-->
```
