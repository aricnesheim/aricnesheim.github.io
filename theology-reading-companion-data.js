/* Student-facing Catholic commentary for Theology 10 readings.
   Summaries are paraphrases. Patristic and Thomistic comments are also
   paraphrased and identified by source so students can distinguish Scripture,
   Church teaching, and interpretation.
   Codex/GPT work product — Aug. 27, 2026. */

(function () {
  "use strict";

  const guides = [
    {
      id: "matthew-2-1-to-4-25",
      choiceLabel: "Current · due Sept. 1 · Matthew 2–4",
      fullReading: "Matthew 1:18–4:25",
      annotatedFocus: "Matthew 1:18–25",
      companionReading: "Matthew 2:1–4:25",
      companionNote: "This companion begins at Matthew 2:1. It does not redo the annotated pericope.",
      assignedDate: "2026-08-26",
      dueDate: "2026-09-01",
      dueLabel: "Tuesday, September 1",
      scenes: [
        {
          id: "magi",
          shortTitle: "Magi",
          reference: "Matthew 2:1–12",
          title: "Epiphany: the nations adore the King",
          recall: "Who moves toward Jesus in this scene—and who feels threatened?",
          summary: "Magi from the east follow the sign of a new king to Jerusalem. Herod and the city's leaders can identify Bethlehem from Scripture, yet the visitors make the journey, find the child with Mary his mother, worship him, and offer gifts. The Church calls this manifestation of Christ to the nations the Epiphany.",
          notice: "The Magi's knowledge becomes a journey and an act of worship. Herod's knowledge becomes fear and resistance.",
          pericope: "In Matthew 1:18–25, the angel announces a child who will save his people and be called Emmanuel. Here, people beyond Israel already seek and adore him, while another king treats his arrival as a threat.",
          pericopeReference: "Look back: Matthew 1:21–23",
          connections: [
            {
              kind: "Scripture",
              text: "Bethlehem, the star, and the gifts gather royal and prophetic threads around Jesus. Matthew directly cites Micah; the other passages work as echoes to test.",
              ref: "Matthew 2:2, 5–6, 11 · Micah 5:1 (NABRE; 5:2 in some editions) · Numbers 24:17 · Isaiah 60:1–6 · Psalm 72:10–11"
            },
            {
              kind: "Catechism",
              text: "The Magi represent the first fruits of the nations: the child they worship is Israel's Messiah, the Son of God, and Savior of the world.",
              ref: "Catechism of the Catholic Church 528"
            },
            {
              kind: "Church Father",
              text: "St. Gregory the Great reads the gifts as a confession of who Christ is: gold for the King, incense for God, and myrrh for the one who will truly die.",
              ref: "Gregory the Great, Forty Gospel Homilies 10.6 · Catena Aurea on Matthew 2:11"
            },
            {
              kind: "Next reading",
              text: "The Magi open their treasures in worship; Herod clutches power in fear. Jesus will soon ask where a disciple stores treasure and which master the heart serves.",
              ref: "Matthew 6:19–24"
            }
          ]
        },
        {
          id: "egypt",
          shortTitle: "Egypt",
          reference: "Matthew 2:13–15",
          title: "The Holy Family's flight into Egypt",
          recall: "What does Joseph do between receiving the warning and leaving Bethlehem?",
          summary: "An angel warns Joseph in a dream that Herod will seek the child. Joseph rises during the night, takes Jesus and Mary into Egypt, and remains there until Herod's death. The Holy Family becomes a refugee family, and Matthew gathers Israel's exodus story around God's Son.",
          notice: "Joseph's obedience is immediate, practical, and protective. Matthew records no speech from him, but his faith acts.",
          pericope: "The dream-and-obey pattern from 1:20–24 continues. Joseph first receives Jesus by naming him; now he receives the task of protecting Jesus and Mary when God's plan still looks hidden.",
          pericopeReference: "Look back: Matthew 1:20–25",
          connections: [
            {
              kind: "Scripture",
              text: "Hosea originally calls Israel God's son coming out of Egypt. Matthew applies the line to Jesus, whose path gathers up the story of Israel.",
              ref: "Matthew 2:15 · Hosea 11:1"
            },
            {
              kind: "Catechism",
              text: "The flight and return reveal Christ sharing his people's exile and inaugurating the new exodus: the true Son comes out of Egypt as liberator.",
              ref: "Catechism of the Catholic Church 530"
            },
            {
              kind: "Church Father",
              text: "St. John Chrysostom notices that Joseph does not object when the promised Savior must flee. He obeys even before he can see how the promise will be fulfilled.",
              ref: "John Chrysostom, Homily 8 on Matthew, 4"
            },
            {
              kind: "Next reading",
              text: "Jesus comes out of Egypt, passes through the Jordan and wilderness, and then ascends the mountain to teach. Matthew lets Israel's path converge on the faithful Son.",
              ref: "Exodus 14–24 · Matthew 2:15 · 3:13–4:11 · 5:1"
            }
          ]
        },
        {
          id: "return",
          shortTitle: "Return",
          reference: "Matthew 2:16–23",
          title: "The Holy Innocents and the home at Nazareth",
          recall: "What three places shape this scene, and why does the family move between them?",
          summary: "Herod orders the killing of young boys around Bethlehem. Matthew hears Rachel's ancient lament in the grief, and the Church remembers the children as the Holy Innocents. After Herod dies, Joseph follows further guidance, returns with the family, avoids Judea, and settles in Nazareth.",
          notice: "Fulfillment language never turns the killing into something good. Herod's cruelty causes the deaths; the promised child enters a history of danger, exile, and mourning.",
          pericope: "Emmanuel does not mean that Joseph's household escapes every danger. The quiet obedience seen in 1:24 continues through repeated decisions that protect the child entrusted to him.",
          pericopeReference: "Look back: Matthew 1:23–24",
          connections: [
            {
              kind: "Scripture",
              text: "Matthew uses Rachel's lament for exiled children to name Bethlehem's grief. In Jeremiah, that lament stands inside a larger promise of return and hope.",
              ref: "Matthew 2:17–18 · Jeremiah 31:15–17"
            },
            {
              kind: "Church teaching",
              text: "The Church venerates the murdered children as the Holy Innocents. Their feast refuses to let victims disappear behind the story of a ruler or a nation.",
              ref: "Catechism of the Catholic Church 530 · Feast of the Holy Innocents, December 28"
            },
            {
              kind: "Catechism",
              text: "Nazareth is not an anticlimax. Jesus' ordinary family life is a school of prayer, work, obedience, and holiness within family life.",
              ref: "Catechism of the Catholic Church 531–533"
            },
            {
              kind: "Next reading",
              text: "The mourners and persecuted children keep the Beatitudes from sounding sentimental: Christ calls mourners and the persecuted blessed without calling the evil done to them good.",
              ref: "Matthew 5:4, 10–12"
            }
          ]
        },
        {
          id: "john",
          shortTitle: "John",
          reference: "Matthew 3:1–12",
          title: "The Forerunner calls Israel to conversion",
          recall: "What does John ask people to change—and what does he refuse to let ancestry prove?",
          summary: "John the Baptist appears in the wilderness announcing that the kingdom of heaven is near. He calls Israel to repentance that bears visible fruit, baptizes in the Jordan, confronts religious presumption, and points to the stronger one who will baptize with the Holy Spirit and fire.",
          notice: "John will not let descent from Abraham substitute for conversion. Belonging to the covenant calls for a life that bears fruit.",
          pericope: "The angel says that Jesus will save his people from their sins. John now announces the fitting response to that mission: repent. The Holy Spirit active in Jesus' conception also stands at the center of John's promise.",
          pericopeReference: "Look back: Matthew 1:18, 20–21",
          connections: [
            {
              kind: "Scripture",
              text: "Matthew identifies John as Isaiah's wilderness voice. His rough garment and leather belt also recall Elijah, a connection Jesus later makes explicit.",
              ref: "Isaiah 40:3 · 2 Kings 1:8 · Matthew 3:3–4 · 11:14 · 17:11–13"
            },
            {
              kind: "Catechism",
              text: "John is the final prophet and the Lord's immediate Forerunner. Through him the Holy Spirit prepares a people ready to receive Christ.",
              ref: "Catechism of the Catholic Church 523, 717–720"
            },
            {
              kind: "Church Father",
              text: "St. John Chrysostom insists that repentance must become virtue. Avoiding evil is not enough if the tree never produces good fruit.",
              ref: "John Chrysostom, Homily 11 on Matthew, 3"
            },
            {
              kind: "Next reading",
              text: "John's image of fruit returns at the Sermon's end: trees are known by their fruit, and hearing Christ's words must become doing them.",
              ref: "Matthew 7:16–27"
            }
          ]
        },
        {
          id: "baptism",
          shortTitle: "Baptism",
          reference: "Matthew 3:13–17",
          title: "The Trinity revealed at the Jordan",
          recall: "Who speaks, who descends, and who stands in the water?",
          summary: "Jesus comes to John for baptism. John hesitates, but Jesus insists that they fulfill all righteousness. As Jesus emerges, the heavens open, the Spirit descends like a dove, and the Father's voice identifies him as the beloved Son. The Church sees Father, Son, and Holy Spirit revealed together.",
          notice: "Jesus does not enter the Jordan because he needs cleansing. He freely stands among sinners as he begins the mission that will lead to the Cross.",
          pericope: "Matthew has already said that Jesus is conceived through the Holy Spirit and is Emmanuel. At the Jordan, the Spirit appears again and the opening claims about Jesus' identity receive a public confirmation.",
          pericopeReference: "Look back: Matthew 1:18, 20, 23",
          connections: [
            {
              kind: "Scripture",
              text: "The Father's declaration joins the royal Son of the Psalms with Isaiah's Servant in whom God delights.",
              ref: "Matthew 3:17 · Psalm 2:7 · Isaiah 42:1"
            },
            {
              kind: "Catechism",
              text: "Jesus accepts and inaugurates the mission of the suffering Servant. Christian Baptism joins believers to his death and rising and makes them adopted children in the Son.",
              ref: "Catechism of the Catholic Church 535–537, 1224–1225"
            },
            {
              kind: "St. Thomas",
              text: "Aquinas says Christ is baptized not to be cleansed but to cleanse and sanctify the waters for the Baptism he will give the Church.",
              ref: "Thomas Aquinas, Summa Theologiae III, q.39, a.1"
            },
            {
              kind: "Next reading",
              text: "The Father names Jesus the beloved Son; in the Beatitudes Jesus calls peacemakers sons of God. That dignity is received by grace and lived in the likeness of the Son.",
              ref: "Matthew 3:17 · 5:9 · Romans 8:14–17"
            }
          ]
        },
        {
          id: "temptation",
          shortTitle: "Testing",
          reference: "Matthew 4:1–11",
          title: "The obedient Son in the wilderness",
          recall: "What would each temptation ask Jesus to prove—or seize?",
          summary: "The Spirit leads Jesus into the wilderness. After forty days of fasting, the tempter pushes him toward self-serving appetite, public display, and worldly rule bought by false worship. Jesus refuses each distortion of his sonship and answers from Deuteronomy.",
          notice: "The tempter can quote Scripture. The issue is not quotation alone, but whether Scripture is received in obedient trust or twisted toward self-exaltation.",
          pericope: "The angel names Jesus as Savior. In the wilderness, Jesus refuses to carry out that mission through appetite, spectacle, domination, or a shortcut around faithful obedience.",
          pericopeReference: "Look back: Matthew 1:21",
          connections: [
            {
              kind: "Scripture",
              text: "Forty days, wilderness, hunger, and Deuteronomy invite comparison with Israel's forty years. Jesus passes through Israel's testing without abandoning trust or worship.",
              ref: "Deuteronomy 8:2–3 · 6:13, 16 · Matthew 4:1–11"
            },
            {
              kind: "Catechism",
              text: "Christ relives Adam's and Israel's testing but remains the obedient Son. His victory in the desert anticipates his final obedience in the Passion.",
              ref: "Catechism of the Catholic Church 538–540"
            },
            {
              kind: "St. Thomas",
              text: "Aquinas sees an escalation: bodily appetite, vainglorious display, then worldly power at the price of worship. Christ refuses every false good.",
              ref: "Thomas Aquinas, Summa Theologiae III, q.41, a.4"
            },
            {
              kind: "Next reading",
              text: "The Sermon answers the same temptations with secret fasting, trust in the Father for bread, treasure in heaven, one Master, and prayer for deliverance from temptation.",
              ref: "Matthew 6:13, 16–34"
            }
          ]
        },
        {
          id: "light",
          shortTitle: "Kingdom",
          reference: "Matthew 4:12–17",
          title: "The Kingdom draws near",
          recall: "What changes after John's arrest, and where does Jesus begin?",
          summary: "After John's arrest, Jesus withdraws to Galilee and settles in Capernaum. Matthew describes the move as light dawning in darkness. The one John announced now proclaims for himself: repent, because the kingdom of heaven has drawn near.",
          notice: "The Kingdom is not merely a topic in Jesus' teaching. God's reign draws near in the person and action of the King.",
          pericope: "Matthew introduced Jesus as Emmanuel. Now God's presence enters a region pictured as darkness and brings light. The fulfillment formula first used in 1:22 appears again to interpret his mission.",
          pericopeReference: "Look back: Matthew 1:22–23",
          connections: [
            {
              kind: "Scripture",
              text: "Matthew presents Jesus' move into Galilee as the dawn promised by Isaiah. Galilee is also where the risen Christ will send his disciples to all nations.",
              ref: "Isaiah 8:23–9:1 (NABRE; 9:1–2 in some editions) · Matthew 4:14–16 · 28:16–20"
            },
            {
              kind: "Catechism",
              text: "Everyone is called to enter the Kingdom through conversion and communion with Christ. The Kingdom belongs to the poor and lowly who receive it with humble hearts.",
              ref: "Catechism of the Catholic Church 541–544, 1427"
            },
            {
              kind: "Church Father",
              text: "St. John Chrysostom notes that Jesus takes up John's summons after the Forerunner is arrested. The call remains, but now the King announces his Kingdom.",
              ref: "John Chrysostom, Homily 14 on Matthew, 1–2"
            },
            {
              kind: "Next reading",
              text: "The light that dawns in Jesus becomes a vocation: disciples reflect his light through works that glorify the Father rather than themselves.",
              ref: "Matthew 5:14–16"
            }
          ]
        },
        {
          id: "calling",
          shortTitle: "Calling",
          reference: "Matthew 4:18–22",
          title: "Apostolic vocation begins",
          recall: "What does each pair leave, and how quickly do they respond?",
          summary: "Jesus calls Simon Peter and Andrew while they cast a net, then James and John while they work with their father. Both pairs leave what they are doing at once. They are not merely enrolling in lessons; Christ gathers them into his own life and mission.",
          notice: "Matthew emphasizes response more than résumé. Vocation begins with the person who calls and the surrender of the one who follows.",
          pericope: "Joseph hears God's command and acts; the fishermen hear Jesus' call and act. In both scenes, obedient trust begins before a long explanation is available.",
          pericopeReference: "Look back: Matthew 1:24 · 2:14, 21",
          connections: [
            {
              kind: "Scripture",
              text: "The promise to gather people develops into the mission discourse and finally the commission to make disciples of all nations.",
              ref: "Matthew 4:19 · 10:1–42 · 28:18–20"
            },
            {
              kind: "Catechism",
              text: "This call begins Christ's gathering of the apostolic people through whom he will shepherd and teach his Church.",
              ref: "Catechism of the Catholic Church 551–553"
            },
            {
              kind: "Church Father",
              text: "St. Gregory the Great focuses not on how much the fishermen owned but on how completely they placed it behind Christ. The heart's surrender is the measure of the gift.",
              ref: "Gregory the Great, Homilies on the Gospels 5.1 · Catena Aurea on Matthew 4:20"
            },
            {
              kind: "Next reading",
              text: "These disciples come to Jesus on the mountain, and he teaches them. The Sermon is first a word to followers before it becomes something admired by crowds.",
              ref: "Matthew 5:1–2 · 7:28–29"
            }
          ]
        },
        {
          id: "ministry",
          shortTitle: "Ministry",
          reference: "Matthew 4:23–25",
          title: "Signs of the Kingdom",
          recall: "Which three actions summarize what Jesus does, and how far do the crowds come?",
          summary: "Jesus travels throughout Galilee teaching in synagogues, proclaiming the Gospel of the Kingdom, and healing disease and infirmity. News spreads, and crowds gather from a wide ring of Jewish and neighboring regions. Truth, proclamation, and compassionate restoration belong together in his ministry.",
          notice: "The healings are real works of mercy and signs of the Kingdom. They point beyond bodily cure toward Christ's final victory over sin and death.",
          pericope: "The mission announced in Jesus' name begins to take visible form among actual people. He saves the whole person, while Matthew still distinguishes bodily healing from the forgiveness of sins.",
          pericopeReference: "Look back: Matthew 1:21",
          connections: [
            {
              kind: "Gospel structure",
              text: "Matthew repeats the teaching–proclaiming–healing summary after the Sermon and miracle stories, forming a frame around chapters 5–9.",
              ref: "Matthew 4:23 · Matthew 5–9 · Matthew 9:35"
            },
            {
              kind: "Catechism",
              text: "Jesus' miracles reveal the Kingdom already present and invite faith in him. They are signs, not performances designed to satisfy curiosity.",
              ref: "Catechism of the Catholic Church 547–550"
            },
            {
              kind: "Church teaching",
              text: "Christ's compassion for the sick concerns the whole person. His healing ministry anticipates the Church's care for the suffering and her sacramental ministry to the sick.",
              ref: "Catechism of the Catholic Church 1503–1505"
            },
            {
              kind: "Next reading",
              text: "The crowds of 4:25 lead directly into 5:1. Chapters 5–7 unfold Jesus' teaching; chapters 8–9 display his healing works; then 9:35 repeats this summary.",
              ref: "Matthew 4:25–5:1 · Matthew 5–9 · Matthew 9:35"
            }
          ]
        }
      ]
    },
    {
      id: "matthew-5-13-to-7-29",
      choiceLabel: "Next · due Sept. 2 · Matthew 5–7",
      fullReading: "Matthew 5:1–7:29",
      annotatedFocus: "Matthew 5:1–12",
      companionReading: "Matthew 5:13–7:29",
      companionNote: "This companion begins at Matthew 5:13. First annotate the Beatitudes in Matthew 5:1–12.",
      assignedDate: "2026-09-01",
      dueDate: "2026-09-02",
      dueLabel: "Wednesday, September 2",
      scenes: [
        {
          id: "salt-light",
          shortTitle: "Salt & light",
          reference: "Matthew 5:13–16",
          title: "A Beatitude life made visible",
          recall: "What are salt and light for—and whom should a disciple's works glorify?",
          summary: "Jesus tells the disciples he has just called blessed that they now have a mission. Their lives should preserve what is good, make truth visible, and lead others to praise the Father. Christian witness is public, but it points beyond the witness.",
          notice: "Jesus is not promising social importance or triumph. The light is meant to reveal the Father's goodness, not collect admiration for the disciple.",
          pericope: "The 'you' who are salt and light are the same 'you' who may be insulted and persecuted in 5:11–12. Christian witness is the public shape of Beatitude life, even under pressure.",
          pericopeReference: "Look back: Matthew 5:10–12",
          connections: [
            {
              kind: "Church Father",
              text: "St. Augustine says salt loses its savor when fear of earthly suffering silences witness. The apostles preserve and enlighten by remaining faithful.",
              ref: "Augustine, On the Sermon on the Mount I.6.16–17"
            },
            {
              kind: "Catechism",
              text: "The Church calls the moral life a form of missionary witness. Deeds should make the Gospel credible and direct attention toward God.",
              ref: "Catechism of the Catholic Church 2044–2046, 2472"
            },
            {
              kind: "Catena Aurea",
              text: "The Fathers gathered by Aquinas hear two duties in these images: resist corruption like salt and illuminate by holy teaching and life.",
              ref: "Thomas Aquinas, Catena Aurea on Matthew 5:13–16"
            }
          ]
        },
        {
          id: "fulfillment",
          shortTitle: "Fulfillment",
          reference: "Matthew 5:17–20",
          title: "The Law fulfilled and written on the heart",
          recall: "What does Jesus say he came to do with the Law and the Prophets?",
          summary: "Jesus has not come to discard the Law and the Prophets. He fulfills them and calls his disciples to a righteousness deeper than outward rule-keeping. The Church calls the Sermon on the Mount the clearest expression of this New Law.",
          notice: "The New Law is not simply a harder list. Christ brings the Old Law to completion and gives the Holy Spirit, who forms obedience from within.",
          pericope: "Those who hunger and thirst for righteousness now learn what Kingdom righteousness looks like. Purity of heart anticipates Jesus' movement from outward acts toward the heart.",
          pericopeReference: "Look back: Matthew 5:6, 8, 10",
          connections: [
            {
              kind: "Church Father",
              text: "St. Augustine says 'fulfill' includes both doing what the Law commands and bringing it to the perfection toward which it points.",
              ref: "Augustine, On the Sermon on the Mount I.8.20"
            },
            {
              kind: "Catechism",
              text: "The Gospel Law fulfills, refines, and surpasses the Old Law. It reforms the heart, gathers its commands in charity, and teaches love of enemies.",
              ref: "Catechism of the Catholic Church 1965–1968"
            },
            {
              kind: "St. Thomas",
              text: "Aquinas says the New Law is chiefly the grace of the Holy Spirit within us and secondarily the written teaching that disposes us to receive and use that grace.",
              ref: "Thomas Aquinas, Summa Theologiae I–II, q.106, a.1 · q.107, a.2"
            }
          ]
        },
        {
          id: "reconciliation",
          shortTitle: "Reconcile",
          reference: "Matthew 5:21–26",
          title: "Anger, contempt, and reconciliation",
          recall: "How far back toward the heart does Jesus trace the violence of murder?",
          summary: "Jesus traces murder back toward the anger and contempt that attack another person's dignity. Reconciliation is urgent enough to interrupt an act of worship. Greater righteousness reaches the interior roots from which outward violence grows.",
          notice: "Jesus does not forbid every experience of anger or all correction. He does forbid nourishing hatred, contempt, and revenge.",
          pericope: "'Blessed are the peacemakers' becomes a concrete command: make peace with the person you have injured. Mercy refuses to reduce another person to an insult.",
          pericopeReference: "Look back: Matthew 5:7, 9",
          connections: [
            {
              kind: "Church Father",
              text: "St. Augustine follows anger as it hardens into expression and insult. The deeper righteousness stops the movement before indignation becomes hatred.",
              ref: "Augustine, On the Sermon on the Mount I.9.21–22 · I.10.26–28"
            },
            {
              kind: "Catechism",
              text: "Anger is a human passion. It becomes gravely wrong when deliberately ordered toward revenge, serious harm, or hatred of another person.",
              ref: "Catechism of the Catholic Church 2302–2303"
            },
            {
              kind: "Catena Aurea",
              text: "The Fathers gathered on the altar saying emphasize that God prizes concord: worship and repaired relationships cannot be sealed into separate compartments.",
              ref: "Catena Aurea on Matthew 5:23–24"
            }
          ]
        },
        {
          id: "purity-fidelity",
          shortTitle: "Purity",
          reference: "Matthew 5:27–32",
          title: "Purity of heart and covenant fidelity",
          recall: "What interior choice does Jesus place beside the outward act of adultery?",
          summary: "Jesus rejects deliberately chosen lust, not only outward adultery. His drastic images call disciples to remove occasions of sin. He then opposes the casual dismissal of a spouse and treats marriage as a covenant that cannot be handled lightly.",
          notice: "Tearing out an eye and cutting off a hand are forceful images for removing occasions of sin, not commands to self-harm.",
          pericope: "The pure in heart learn to see another person as a person, not an object. Mourning for sin leads to conversion rather than excuse-making.",
          pericopeReference: "Look back: Matthew 5:4, 8",
          connections: [
            {
              kind: "Church Father",
              text: "St. Augustine distinguishes a temptation's suggestion, the pleasure it awakens, and the will's consent. Sin is not identical with an unwanted first movement.",
              ref: "Augustine, On the Sermon on the Mount I.12.33–36"
            },
            {
              kind: "Catechism",
              text: "Purity of heart integrates desire, intellect, will, and bodily life. It grows through grace, prayer, discipline, and respect for the dignity of persons.",
              ref: "Catechism of the Catholic Church 2517–2520"
            },
            {
              kind: "Marriage",
              text: "The Church treats adultery as an injury to the marriage covenant. She also recognizes that separation can sometimes be legitimate and that civil divorce may be tolerated for legal protection.",
              ref: "Catechism of the Catholic Church 2380–2386"
            }
          ]
        },
        {
          id: "enemy-love",
          shortTitle: "Enemy-love",
          reference: "Matthew 5:33–48",
          title: "Truth, non-retaliation, and enemy-love",
          recall: "What does Jesus ask disciples to do when truth, injury, and enemies put love under pressure?",
          summary: "Disciples should speak truth without manipulation, surrender vengeance, practice surprising generosity, and pray for enemies. They imitate the Father, who gives sun and rain even to the unjust. Jesus moves from controlling retaliation to transforming the heart that wants revenge.",
          notice: "Enemy-love does not require remaining in danger, hiding abuse, or pretending evil is good. Jesus forbids revenge and hatred, not prudent safety or just authority.",
          pericope: "The meek, merciful, peacemakers, and persecuted all meet here. Enemy-love is the Beatitudes practiced under pressure.",
          pericopeReference: "Look back: Matthew 5:5, 7, 9–12",
          connections: [
            {
              kind: "Church Father",
              text: "St. Augustine sees 'an eye for an eye' as a restraint on vengeance that Christ brings to completion by forming a heart that no longer seeks revenge.",
              ref: "Augustine, On the Sermon on the Mount I.19.56–62"
            },
            {
              kind: "Church Father",
              text: "Augustine says enemy-love loves the human person God made while refusing the evil that harms that person. Charity and moral clarity belong together.",
              ref: "Augustine, On the Sermon on the Mount I.21.69–70"
            },
            {
              kind: "Catechism",
              text: "Forgiveness and prayer for enemies become possible as the Holy Spirit gives Christians the mind and love of Christ.",
              ref: "Catechism of the Catholic Church 2303, 2843–2845"
            }
          ]
        },
        {
          id: "almsgiving",
          shortTitle: "Almsgiving",
          reference: "Matthew 6:1–4",
          title: "Mercy before the Father",
          recall: "What can turn a genuinely good gift into a performance?",
          summary: "Giving to the needy remains good, but applause must not become its goal. The Father sees both the gift and the giver's hidden intention. Christ purifies the motive without cancelling the work of mercy.",
          notice: "'In secret' does not forbid accountable or organized charity. The issue is whether human praise has become the deed's final purpose.",
          pericope: "Almsgiving makes mercy active. Doing it without self-display joins mercy to poverty of spirit and purity of heart.",
          pericopeReference: "Look back: Matthew 5:3, 7–8",
          connections: [
            {
              kind: "Church Father",
              text: "St. Augustine says the problem is not that someone happens to see a good deed. The problem is doing it so that human praise becomes the goal.",
              ref: "Augustine, On the Sermon on the Mount II.1.1–2 · II.2.5–9"
            },
            {
              kind: "Catechism",
              text: "Almsgiving, prayer, and fasting are three principal forms of interior conversion. Almsgiving is both fraternal charity and an act of justice toward the poor.",
              ref: "Catechism of the Catholic Church 1434, 2447"
            },
            {
              kind: "St. Thomas",
              text: "Aquinas treats almsgiving as a representative work of love of neighbor within the New Law's formation of Christian action.",
              ref: "Thomas Aquinas, Summa Theologiae I–II, q.108, a.3, ad 4"
            }
          ]
        },
        {
          id: "our-father",
          shortTitle: "Our Father",
          reference: "Matthew 6:5–15",
          title: "Learning to pray as the Church",
          recall: "What comes first in the Our Father: God's glory, or the disciple's needs?",
          summary: "Prayer is not a performance or a technique for controlling God. Jesus gives the disciples the Our Father: three petitions directed especially toward God's name, Kingdom, and will, followed by four concerning bread, forgiveness, temptation, and evil.",
          notice: "Jesus rejects empty wordiness, not all lengthy or repeated prayer. The question is whether prayer is trusting communion with the Father or a display.",
          pericope: "Children of God say 'Our Father.' The merciful ask and give forgiveness. Those who hunger for righteousness ask for the Kingdom, daily bread, and the Father's will.",
          pericopeReference: "Look back: Matthew 5:6–9",
          connections: [
            {
              kind: "Catechism",
              text: "The Church receives the Our Father as the fundamental Christian prayer and, following Tertullian, calls it a summary of the whole Gospel.",
              ref: "Catechism of the Catholic Church 2759–2761, 2803–2806"
            },
            {
              kind: "Church Father",
              text: "St. Cyprian notes that Christ teaches 'Our Father,' not merely 'my Father.' Christian prayer is ecclesial: even in private, it includes others.",
              ref: "Cyprian, On the Lord's Prayer · Catena Aurea on Matthew 6:9"
            },
            {
              kind: "Church Father",
              text: "St. Augustine hears daily food, Eucharistic bread, and nourishment from God's word within the petition for daily bread. These senses enrich rather than cancel one another.",
              ref: "Augustine, On the Sermon on the Mount II.7.25–27"
            },
            {
              kind: "Patristic map",
              text: "Augustine also places the seven petitions beside the Beatitudes. It is a fruitful meditation on the Sermon's unity, not a required one-to-one scheme.",
              ref: "Augustine, On the Sermon on the Mount II.11.38"
            }
          ]
        },
        {
          id: "fasting",
          shortTitle: "Fasting",
          reference: "Matthew 6:16–18",
          title: "Fasting without theater",
          recall: "How should the fasting disciple appear to other people?",
          summary: "A disciple fasts before the Father, not as a costume designed to win admiration. Jesus tells the fasting person to appear ordinary—even joyful. The hidden practice trains desire while keeping God, not the audience, at the center.",
          notice: "Fasting is neither a diet trick nor a public badge of seriousness. Particular obligations also take age and health into account.",
          pericope: "Fasting gives bodily form to mourning for sin and hunger for righteousness. Purity of heart keeps the act directed toward God.",
          pericopeReference: "Look back: Matthew 5:4, 6, 8",
          connections: [
            {
              kind: "Catechism",
              text: "The Church retains fasting as a principal form of Christian penance and gives it a special place on penitential days and during Lent.",
              ref: "Catechism of the Catholic Church 1434, 1438"
            },
            {
              kind: "Church Father",
              text: "St. Augustine reads the ordinary, joyful face as a sign of inward joy and of a heart no longer divided by the desire for praise.",
              ref: "Augustine, On the Sermon on the Mount II.12.39–40"
            },
            {
              kind: "St. Thomas",
              text: "Aquinas treats fasting as a representative practice by which Christians curb disordered desire and become freer for God.",
              ref: "Thomas Aquinas, Summa Theologiae I–II, q.108, a.3, ad 4"
            }
          ]
        },
        {
          id: "treasure",
          shortTitle: "Treasure",
          reference: "Matthew 6:19–24",
          title: "Treasure, the sound eye, and two masters",
          recall: "What three images does Jesus use to ask what governs the heart?",
          summary: "What a person treasures shapes the heart. The 'sound eye' names an undivided intention. Wealth becomes a rival master when it controls a person's service. Jesus asks not only what we own but what owns us.",
          notice: "Jesus does not declare every possession evil or romanticize deprivation. He asks which good has become ultimate and who rules the heart.",
          pericope: "Poverty of spirit receives everything from God rather than being possessed by possessions. The pure heart is the single or undivided eye.",
          pericopeReference: "Look back: Matthew 5:3, 8",
          connections: [
            {
              kind: "Church Father",
              text: "St. Augustine interprets the eye as intention: even an outwardly good action becomes dark when directed toward applause or earthly gain.",
              ref: "Augustine, On the Sermon on the Mount II.13.44–46"
            },
            {
              kind: "St. Thomas",
              text: "Aquinas says Christ orders the disciple's intention away from human praise and from making the acquisition of riches life's controlling purpose.",
              ref: "Thomas Aquinas, Summa Theologiae I–II, q.108, a.3"
            },
            {
              kind: "Catechism",
              text: "Money can become an idol. Every disciple is called to poverty of heart: detachment from riches and trust in the Father's providence.",
              ref: "Catechism of the Catholic Church 2113, 2544–2547"
            },
            {
              kind: "Church Father",
              text: "St. Jerome distinguishes possessing riches from serving them. The decisive question is whether wealth has become master.",
              ref: "Jerome in the Catena Aurea on Matthew 6:24"
            }
          ]
        },
        {
          id: "providence",
          shortTitle: "Providence",
          reference: "Matthew 6:25–34",
          title: "Seek first the Kingdom",
          recall: "What does Jesus ask the disciple to seek first, and what examples does he give?",
          summary: "The Father feeds birds and clothes flowers, and human beings matter more. Anxiety cannot secure tomorrow. The disciple seeks the Kingdom and its righteousness first, trusts divine providence, and then meets today's duties faithfully.",
          notice: "This is not a rebuke to a person with an anxiety disorder or a promise that Christians never suffer need. Trust and prudent responsibility belong together.",
          pericope: "'Hunger and thirst for righteousness' is now named as life's first priority. Poverty of spirit entrusts the future to the Father.",
          pericopeReference: "Look back: Matthew 5:3, 6",
          connections: [
            {
              kind: "St. Thomas",
              text: "Aquinas says Jesus forbids inordinate anxiety about temporal things, not the reasonable care needed to secure them.",
              ref: "Thomas Aquinas, Summa Theologiae I–II, q.108, a.3, ad 5"
            },
            {
              kind: "Church Father",
              text: "St. Augustine notes that responsible provision can be a duty. St. Paul's own hunger also shows that the passage is not a prosperity guarantee.",
              ref: "Augustine, On the Sermon on the Mount II.15–17 (§§49–58)"
            },
            {
              kind: "Catechism",
              text: "Filial trust cooperates with providence rather than becoming idleness. Christ frees disciples from the nagging worry that tries to possess tomorrow.",
              ref: "Catechism of the Catholic Church 2828–2831, especially 2830"
            }
          ]
        },
        {
          id: "mercy-judgment",
          shortTitle: "Mercy",
          reference: "Matthew 7:1–12",
          title: "Clear-sighted mercy",
          recall: "What must happen before one person can help with another person's speck?",
          summary: "Jesus forbids hypocritical and rash judgment: remove the beam before helping with the speck. Use prudence with holy things, trust the Father enough to ask, and treat others with the good you would want from them.",
          notice: "'Judge not' is not moral relativism. Jesus forbids condemnation and hypocrisy; he does not forbid recognizing a wrong or making a just and prudent judgment.",
          pericope: "Mercy begins with honest self-examination. A purified heart can then help rather than condemn. The Golden Rule gives mercy a daily form.",
          pericopeReference: "Look back: Matthew 5:7–8",
          connections: [
            {
              kind: "Church Father",
              text: "St. Augustine distinguishes rash claims about hidden motives from recognizing a manifest wrong. Even correction must leave room for repentance.",
              ref: "Augustine, On the Sermon on the Mount II.18–19 (§§59–66)"
            },
            {
              kind: "Catechism",
              text: "The Church forbids rash judgment and asks for a favorable interpretation of another's thoughts, words, and deeds whenever reasonably possible.",
              ref: "Catechism of the Catholic Church 2477–2478"
            },
            {
              kind: "St. Thomas",
              text: "Aquinas says Christ forbids disordered judgment, not every just judgment or act of fraternal correction.",
              ref: "Thomas Aquinas, Summa Theologiae I–II, q.108, a.3, ad 6"
            },
            {
              kind: "Golden Rule",
              text: "Jesus says the Golden Rule sums up the Law and the Prophets. It is active: imagine the good you rightly desire, then take the initiative in doing it for another.",
              ref: "Matthew 7:12 · Catechism of the Catholic Church 1789, 1970"
            }
          ]
        },
        {
          id: "two-ways",
          shortTitle: "Two ways",
          reference: "Matthew 7:13–20",
          title: "The narrow gate and the test of fruit",
          recall: "What two tests does Jesus give: where a way ends, and what a tree produces?",
          summary: "Jesus presents a real choice between ways that end in life or destruction. False prophets may look harmless, so disciples must examine the fruit a teacher and teaching actually produce. Appearances and popularity are both incomplete tests.",
          notice: "Jesus' word 'few' should not be turned into a saved-versus-damned statistic. Being in a minority is not itself proof that a group is true.",
          pericope: "The narrow way has already been mapped by the Beatitudes: poverty of spirit, meekness, mercy, purity, peacemaking, and faithfulness under persecution.",
          pericopeReference: "Look back: Matthew 5:3–12",
          connections: [
            {
              kind: "Catechism",
              text: "The New Law places a decisive choice between two ways before the disciple and centers that choice on putting Christ's words into practice.",
              ref: "Catechism of the Catholic Church 1970"
            },
            {
              kind: "Church Father",
              text: "St. Augustine says the way is not narrow because Christ's yoke is cruel, but because few are willing to persevere in its humble demands.",
              ref: "Augustine, On the Sermon on the Mount II.23.77"
            },
            {
              kind: "Church Father",
              text: "Augustine warns that even prayer, fasting, and almsgiving can become sheep's clothing. The fruit of charity is a more searching test than religious appearance.",
              ref: "Augustine, On the Sermon on the Mount II.24.78–81"
            }
          ]
        },
        {
          id: "rock",
          shortTitle: "Rock",
          reference: "Matthew 7:21–29",
          title: "Hearing, doing, and building on Christ",
          recall: "What three things does Jesus say are not enough without doing the Father's will?",
          summary: "Religious language, spectacular deeds, and even hearing Jesus are not substitutes for doing the Father's will. The person who practices Christ's words builds on rock and can withstand the storm. The crowd recognizes that Jesus teaches with unique authority.",
          notice: "This is not salvation earned without grace. Catholic theology calls obedient charity the fruit of Christ's grace and the indwelling Holy Spirit.",
          pericope: "The Kingdom promised in the Beatitudes must become practiced obedience. Hearing 'blessed are the merciful' is not yet the same as performing mercy.",
          pericopeReference: "Look back: Matthew 5:3–12",
          connections: [
            {
              kind: "Church Father",
              text: "St. Augustine says the true fruit is doing the Father's will. Miracles and religious claims do not by themselves prove holiness.",
              ref: "Augustine, On the Sermon on the Mount II.25.82–86"
            },
            {
              kind: "Church Father",
              text: "St. Gregory points to charity and humility, rather than mighty works, as marks of an authentic disciple.",
              ref: "Gregory the Great, Moralia on Job XX.7 · Catena Aurea on Matthew 7:21–23"
            },
            {
              kind: "St. Thomas",
              text: "Aquinas observes that profession of faith, miracles, and hearing are insufficient when severed from obedience shaped by grace.",
              ref: "Thomas Aquinas, Summa Theologiae I–II, q.108, a.3"
            },
            {
              kind: "Catechism",
              text: "Living faith works through charity. The New Law commands, but it also gives the Holy Spirit's grace by which Christ's words can be lived.",
              ref: "Catechism of the Catholic Church 1815, 1966, 1972"
            }
          ]
        }
      ]
    }
  ];

  window.THEOLOGY_READING_COMPANION_REGISTRY = {
    defaultId: guides[0].id,
    guides: guides
  };

  /* Compatibility for browsers that have the previous renderer cached. */
  window.THEOLOGY_READING_COMPANION = guides[0];
})();
