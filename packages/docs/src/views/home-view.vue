<script setup lang="ts">
  import GlobalFooter from '@/components/global-footer.vue'
  import {
    Button,
    Flex,
    HybridIcon,
    Paper,
    Scroller,
    SquareImage,
    Text
  } from '@vue-material/core'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const features = [
    {
      icon: 'mdi:feather',
      title: 'Size Matters',
      description: `At <b>150kb</b> minified (and a lean<b> 40kb</b>
        gzipped), it won't weigh down your project. Plus, it's
        <b>tree-shakable</b>, so you can keep your bundle slim and trim.`
    },
    {
      icon: 'mdi:brush-variant',
      title: 'Intuitive Styling',
      description: `Use attributes like <b>p, m, width, and height</b> to
        style your components. It's like a pro or like someone who just
        Googled “what is CSS?”`
    },
    {
      icon: 'mdi:palette-swatch-outline',
      title: 'Material <s>You</s> Me',
      description: `Follows Material Design 3 guidelines, sometimes not,
        because if Google likes it, it's probably good for you too. Well, 
        looks good to me.`
    },
    {
      icon: 'material-symbols:palette-outline',
      title: 'Real-time Color Engine',
      description: `Change your app's look faster than you can say
        “Material You,” because who doesn't like having choices?`
    },
    {
      icon: 'line-md:iconify1',
      title: 'Icons Overload',
      description: `With <b>@iconify/vue</b> integration, you get access to
        over <b>200,000 icons</b>. It's like having a giant sticker book 
        but for grown-ups.`
    },
    {
      icon: 'mdi:latest',
      title: 'Not for your old browser',
      description: `Enjoy all the latest and greatest features of Vue 3 
        while adhering to the latest Material Design 3 standards. Sorry, 
        IE lovers; we left the past behind.`
    },
    {
      icon: 'mdi:alpha',
      title: 'Active Development',
      description: `<b>Currently in Alpha</b> where we pretend bugs are 
        just misunderstood features.`
    }
  ]
</script>

<template>
  <div class="home">
    <div class="container">
      <div class="container-logo">
        <SquareImage
          :size="200"
          frame="circle"
          src="/logo.svg"
          alt="@vue-material/core"
        />
      </div>

      <div class="container-content">
        <h1 class="container-content-title">
          Yet Another
          <Text as="span" color="$primary-40">Material Components </Text>
          Library for Vue 3.
        </h1>

        <p>Collection of Material Components for Vue 3.</p>

        <Flex gap="#xs" wrap="wrap">
          <Button
            right-icon="mdi:arrow-right"
            label="Get Started"
            @click="router.push('/docs/getting-started')"
          />
          <Button
            as="a"
            variant="tonal"
            left-icon="mdi:code-tags"
            right-icon="mdi:open-in-new"
            label="Source"
            href="https://www.github.com/obillekyle/components"
            target="_blank"
          />
        </Flex>
      </div>
    </div>

    <Text as="h2" size="#xxl"> Key Features </Text>

    <div class="features">
      <Paper
        :key="index"
        class="feature"
        variant="outlined"
        v-for="({ icon, title, description }, index) in features"
      >
        <HybridIcon class="feature-icon" :icon="icon" :size="32" />
        <Scroller as="h3" class="feature-title">
          <span v-html="title" />
        </Scroller>
        <p v-html="description" />
      </Paper>
    </div>
  </div>

  <GlobalFooter max-width="1000px" />
</template>

<style lang="scss">
  .home {
    width: 100%;
    max-width: 1000px;
    margin-inline: auto;
    padding-inline: var(--lg);
  }

  .features {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--sm);
  }

  .feature {
    transition: outline-color 0.2s;

    &:hover {
      outline-color: var(--primary);
    }

    &-icon {
      display: grid;
      width: var(--component-md);
      place-items: center;
      aspect-ratio: 1;
      border-radius: var(--xs);
      color: var(--on-primary-container);
      background: var(--surface-container-highest);
    }

    &-title {
      font-size: var(--xl);
      font-weight: 600;
      margin-block: var(--md);
      color: var(--on-surface);
    }
  }

  .container {
    display: flex;
    place-items: center;
    flex-direction: row-reverse;
    min-height: calc(100dvh - var(--navbar-size));

    &-logo {
      margin-inline: auto;
      filter: drop-shadow(0 0 2px var(--outline))
        drop-shadow(-25px -30px 40px var(--primary-container))
        drop-shadow(15px 30px 20px var(--tertiary-container));
    }

    &-content {
      max-width: 600px;
      gap: var(--lg);
      margin-right: auto;

      &-title {
        font-size: var(--component-lg);
        line-height: 1.1;
      }

      p {
        line-height: 1.5;
        font-size: var(--font-xl);
      }
    }
  }

  @media (width <= 900px) {
    .container {
      text-align: center;
      text-wrap: balance;
      justify-content: center !important;
      flex-direction: column !important;

      &-logo {
        margin-inline: auto;
        margin-bottom: var(--lg);

        image,
        path {
          animation-play-state: paused !important;
        }
      }

      &-content {
        z-index: 1;
        margin-inline: auto;

        &-title {
          font-size: var(--component-sm);
        }
      }

      .md-flex {
        justify-content: center;
      }
    }
  }
</style>
