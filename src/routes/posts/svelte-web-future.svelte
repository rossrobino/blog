<script>
    import Code from "$lib/Code.svelte"
</script>

<svelte:head>
    <title>blog.robino.dev - How Svelte is Changing the Future of the Web</title>
    <meta name="description" content="Ross Robino's Blog" />
</svelte:head>

<h2>How Svelte is Changing the Future of the Web</h2>
<p><a href="https://robino.dev/">Ross Robino</a></p>
<p>8/7/22</p>

<section>
    <h3>I have an idea, how should I build it?</h3>
    <p>
        Web development is a beautiful way to create products. 
        They are accessible through screen readers and 
        <a href="https://www.afb.org/node/16207/refreshable-braille-displays">braille displays</a>.
        Scalable globally in a few clicks with tooling like 
        <a href="https://vercel.com/">Vercel</a> and 
        <a href="https://www.netlify.com/">Netlify</a>. 
        Flexible enough to run on a 
        <a href="https://i.pcmag.com/imagery/reviews/06870e23OE2TT9xK4MXp96u-1..v1629382976.jpg">Galaxy Fold</a> 
        or a 
        <a href="https://i.ytimg.com/vi/R9gbzzOLlgU/hqdefault.jpg">Nintendo Wii</a>.
        The ability to create content that can be accessed by almost anyone, almost anywhere, by countless devices is powerful to say the least. Web tooling is important, it helps ensure that software developers can create the best products and ship them to the most people possible.
    </p>
    <p>
        In front-end development we are faced with a barrage of solutions to choose from to solve problems.
        As I entered back into the world of front-end development, 
        I found that 
        <a href="https://svelte.dev/">Svelte</a>'s
        developer experience enabled me to work effectively and efficiently to develop higher quality products.
    </p>
</section>

<section>
    <h3>Outdated</h3>
    <p>
        I wanted to create a web app after a 7 year hiatus from serious programming. I started again with the skills I learned in school. My Intro to Webpage Programming 101 class taught me the basics of HTML and CSS. This was my development tooling and process:
    </p>
    <ul>
        <li>
            <strong>Tooling - </strong> 
            <a href="https://notepad-plus-plus.org/">Notepad++</a>, 
            web browsers, 
            <a href="https://winscp.net/eng/index.php">WinSCP</a>
        </li>
        <li>
            <strong>Develop -</strong> draft my content, structure with HTML tags, and style with CSS. Type, refresh, type, refresh, search, type!
        </li>
        <li>
            <strong>Deploy -</strong> drag my project into the correct folder using WinSCP to upload to my school's server.
        </li>
        <li>
            <strong>Done!</strong> 
        </li>
    </ul>
    <p>
        It was fairly quick, and I had an good understanding of every character I typed.
    </p>
    <p>
        I started with creating a website using the principles I remembered from this course. Almost every aspect of my tooling needed an upgrade. The basic functionality required for my app was to be able to send a request to an API, manipulate some data, and display it in a chart. I started my research for the best way to accomplish this.
    </p>
</section>

<section>
    <h3>What Kind of Bait do You Use?</h3>
    <p>
        Tooling is incredibly important in any project whether you are building in a real or virtual environment. Humans love to utilize the best tools possible in order to make sure they are spending the least amount of time doing things that they don't want to do.
    </p>
    <p>
        Just like developers enjoy spending their time writing innovative code, Fishermen like to spend their time catching fish. Immense thought goes into each tool fishermen utilize to make sure they spend their time effectively. A fishing stack might consist of a boat, pole, line, hook, and bait. Everyone needs to determine the right stack for the job they are trying to accomplish.
    </p>
    <p>
        I quickly realized that there is an infinite number of methods and stacks to accomplish these common requirements. I found I could not easily do this all from scratch. I read some articles about using front-end frameworks compared using vanilla HTML, CSS, and JavaScript. As you can imagine, I found a wide variety of opinions on the matter.
    </p>
    <p>
        I wanted to get building and ship fast. I could not learn or even attempt to try out every option, and I had nothing to show after a few weeks of work in my spare time. After a hours of research and countless tutorials I needed to make a decision. I heard Scott Tolinski talking about Svelte on the Syntax.fm podcast. I looked it up and found that Svelte and <a href="https://kit.svelte.dev/">SvelteKit</a> were the tooling I was looking for.
    </p>
</section>

<section>
    <h3>Sin Tax</h3>
    <p>
        Syntax is a steep hill to climb as a beginner, Svelte was the smallest hill I could find. As someone who had a basic understanding of HTML, CSS, and JavaScript, Svelte's syntax was comfortably familiar. I was spending much less time paying JavaScript boilerplate taxes and spending more time catching fish. There were less imports, functions, and returns. Script, markup, and styles working together in a simpler way.
    </p>
    <p>
        <i>How do I create a prop?</i>
        <Code>
            export let count = 0;
        </Code>
    </p>
    <p>
        <i>How do I render a list of items?</i>
        <Code>
            &#123; #each cats as cat &#125 <br>
            ... <br>
            &#123; /each &#125
        </Code>
    </p>
    <p>
        <i>How do I initialize the state of a component?</i>
    </p>
    <p>
        <strong>React:</strong> 
        <Code>
            const [count, setCount] = useState(0);
        </Code>
        <strong>Svelte:</strong> 
        <Code>
            let count = 0;
        </Code>
    </p>
    <p>
        <i>
            To learn more about Svelte's simple syntax, check out this 
            <a href="https://svelte.dev/blog/write-less-code">post</a> 
            from Rich Harris discussing Svelte syntax compared with 
            <a href="https://reactjs.org/">React</a> and 
            <a href="https://vuejs.org/">Vue</a>.
        </i>
        
    </p>
    <p>
        I understood the code I was writing, and I immediately felt more comfortable with Svelte than any other front-end framework I had tried.
    </p>
    <p>
        I came to the conclusion these efficiencies could greatly decrease my time to ship. First, I could get through the 
        <a href="https://svelte.dev/tutorial/basics">Svelte tutorial</a> 
        in just a couple days. Second, I knew I was coding with fewer errors. This could dramatically increase my efficiency in the long run. Svelte allowed me to save time on each line by eliminating key strokes and requiring less code to brain translation through its simpler syntax.
    </p>
</section>

<section>
    <h3>&lt;One svelte=to bind:them&gt;</h3>
    <p>
        Some of the best tools are the ones that solve the widest variety of problems. Svelte and SvelteKit provide me with a flexible method to create a wide variety of products. From single components to entire applications Svelte can be utilized to build high quality products. Although Svelte's community is far smaller other frameworks like React, Svelte is gaining traction. One of the most recent web apps released that has been exciting the Svelte community is the new 
        <a href="https://beta.music.apple.com/">Apple Music player</a>.
        This demonstrates how Svelte can be utilized for something as simple as this blog post to an enterprise application.
    </p>
</section>

<section>
    <h3>Levels of Complexity</h3>
    <p>
        All of programming can be abstracted to different levels of complexity, from binary, to Python, to a "no-code" tool like 
        <a href="https://webflow.com/">Webflow</a>.
        Abstraction has allowed programmers to have a better developer experience and get things done faster. Abstraction's rival is flexibility. As languages and frameworks become more abstract and enable developers to work faster, they often limit them in what they can accomplish. Svelte takes a step forward in abstracting HTML, CSS, and JavaScript. It provides efficiency in the syntax and quality in final product delivered. Svelte manages to push the abstraction boundary while maintaining flexibility. Where you can use JavaScript, you can use Svelte.
    </p>
    <p>
        Svelte not only enables developers to write less code with a carefully crafted developer experience, but also it enables them to ship less code resulting in a better final product. Svelte and SvelteKit allow me to build more performant and accessible websites right out of the box.
    </p>
</section>
<section>
    <h3>Truly Innovative</h3>
    <p>
        In 
        <i>
            <a href="https://books.google.com/books/about/How_Google_Works.html?id=Yk9zAwAAQBAJ">How Google Works</a>,
        </i> Eric Schmidt and Jonathan Rosenberg discuss what makes a truly innovative product. They characterize innovation as being "new, surprising, and radically useful."
    </p>
    <p>
        Svelte takes a new approach to developer experience through being a compiler instead of a framework. This enables Svelte to have its own language and work outside the constraints of JavaScript when necessary. Regardless if you are a beginner or advanced developer, the clarity and familiarity of Svelte is undeniable.
    </p>
    <p>
        Svelte is surprising in the flexibility it has amidst the extra layer of abstraction. Svelte can work where JavaScript works, it is unopinionated, flexible, and fast. I personally enjoy using VS Code, Vercel, and Tailwind to create websites. I have found Svelte to be well supported by all of these with tutorials and plugins.
    </p>
    <p>
        Svelte is radically useful for me to quickly create websites using the existing skills that I have. I am able to easily apply my skills and share code with others due to the simplicity of the language. Other people's code is easier to understand with less boilerplate, resulting in smaller barriers to entry for open source contributions.
    </p>
    <p>
        <strong>Thanks for reading!</strong>
    </p>
</section>