library(shiny)
library(reactlog)

reactlog_enable()

ui <- fluidPage(
  numericInput("a", "A", 3),
  numericInput("b", "B", 4),
  verbatimTextOutput("c"),
  reactlog_module_ui(),
  reactlog_widget_module_ui(),
  actionButton("refresh_widget", "Refresh widget"),
  reactlog_widget_output("widget")
)

server <- function(input, output, session) {
  a2 <- reactive(input$a * input$a, label = "a^2")
  b2 <- reactive(input$b * input$b, label = "b^2")
  output$c <- renderText(sqrt(a2() + b2()))

  reactlog_module_server()
  reactlog_widget_module_server()

  output$widget <- render_reactlog_widget({
    input$refresh_widget
    reactlog_widget(session_token = session$token)
  })
}

shinyApp(ui, server)
