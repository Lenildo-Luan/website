import { type Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
} from '@/components/SocialIcons'
import portraitImage from '@/images/portrait.avif'

function SocialLink({
  className,
  href,
  children,
  icon: Icon,
}: {
  className?: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <li className={clsx(className, 'flex')}>
      <Link
        href={href}
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-orange-500 dark:text-zinc-200 dark:hover:text-orange-500"
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-orange-500" />
        <span className="ml-4">{children}</span>
      </Link>
    </li>
  )
}

function MailIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
      />
    </svg>
  )
}

export const metadata: Metadata = {
  title: 'About',
  description:
    'I’m Lenildo Luan. I live in New York City, where I design the future.',
}

export default function About() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        <div className="lg:pl-20">
          <div className="max-w-xs px-2.5 lg:max-w-none">
            <Image
              src={portraitImage}
              alt=""
              sizes="(min-width: 1024px) 32rem, 20rem"
              className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
            />
          </div>
        </div>
        <div className="lg:order-first lg:row-span-2">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            Um pouco mais sobre mim<span className="text-orange-500 dark:text-orange-400">...</span>
          </h1>
          <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
            <p>
              Desde que me entendo por gente, sou uma pessoa curiosa e criativa.
              Sempre quis entender como tudo funciona e amava criar novas coisas. 
              Essas duas características fizeram eu me apaixonar por computadores 
              e tecnologia, que me ajudaram a entender mais sobre o mundo e me 
              empoderaram a criar o meu próprio.
            </p>
            <p>
              Cresci em uma pequena capital do Nordeste, sem muitas condições
              financeiras. Mas eu não deixei isso me impedir. Comecei a aprender 
              sozinho, lendo livros, assistindo vídeos e experimentando com o que 
              eu tinha. Com o tempo, fui me aprofundando mais, e quanto mais me 
              aprofundava, mais me empolgava, era como ter super poderes!
            </p>
            <p>
              Durante a faculdade, emergi completamente na área, me envolvendo em 
              vários projetos. Voluntários, acadêmicos, empredimentos e pessoais. 
              Eu queria aprender sobre tudo, me envolvendo no que era possível. 
              O que me ajudou a encontrar minha verdadeira paixão: resolver 
              problemas através da tecnologia.
            </p>
            <p>
              Hoje, cofundei a kalilu, onde posso usar minha curiosidade e criatividade 
              para resolver os problemas das pessoas usando tecnologia. Estou sempre 
              aprendendo e me desafiando a ser melhor, como profissional e pessoa. 
              Acredito que a tecnologia pode mudar o mundo, e quero fazer parte 
              dessa mudança.
            </p>
          </div>
        </div>
        <div className="lg:pl-20">
          <ul role="list">
            {/* <SocialLink href="#" icon={XIcon}>
              Follow on X
            </SocialLink> */}
            <SocialLink href="https://www.instagram.com/lenildoluan/" icon={InstagramIcon} className="mt-4">
              Me siga no Instagram
            </SocialLink>
            <SocialLink href="https://github.com/Lenildo-Luan" icon={GitHubIcon} className="mt-4">
              Me siga no GitHub
            </SocialLink>
            <SocialLink href="https://www.linkedin.com/in/lenildoluan/" icon={LinkedInIcon} className="mt-4">
              Me siga no LinkedIn
            </SocialLink>
            <SocialLink
              href="mailto:spencer@planetaria.tech"
              icon={MailIcon}
              className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
            >
              lenildoluan@gmail.com
            </SocialLink>
          </ul>
        </div>
      </div>
    </Container>
  )
}
